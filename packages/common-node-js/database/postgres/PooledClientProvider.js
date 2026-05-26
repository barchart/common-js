const log4js = require('log4js'),
	pg = require('pg');

const promise = require('@barchart/common-js/lang/promise');

const Client = require('./Client'),
	ClientProvider = require('./ClientProvider');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('common-node/database/postgres/PooledClientProvider');

	/**
	 * A Postgres {@link ClientProvider} which uses a a connection pool.
	 *
	 * @public
	 * @extends {ClientProvider}
	 * @param {String} host
	 * @param {String} database
	 * @param {String} username
	 * @param {String} password
	 * @param {Number=} port
	 * @param {String=} applicationName
	 * @param {*=} ssl
	 */
	class PooledClientProvider extends ClientProvider {
		constructor(host, database, username, password, port, applicationName, ssl) {
			super(host, database, username, password, port, applicationName, ssl);

			this._pool = new pg.Pool(this.getConfiguration());
			this._preparedStatementMap = {};

			this._pool.on('error', (e, client) => {
				logger.error('Postgres connection pool experienced an error', e);
			});
		}

		_getClient() {
			return promise.build((resolveCallback, rejectCallback) => {
				const configuration = this.getConfiguration();

				logger.debug('Creating new [PooledClient] for [', configuration.host, '] [', configuration.database, ']');

				this._pool.connect((e, pgClient, releaseCallback) => {
					if (e) {
						logger.error('Failed to connect [PooledClient] to [', configuration.host, '] [', configuration.database, ']', e);

						rejectCallback(e);
					} else {
						const client = new PooledClient(pgClient, this._preparedStatementMap, releaseCallback);

						logger.info('Created new [PooledClient] [', client.id, '] for [', configuration.host, '] [', configuration.database, ']');

						resolveCallback(client);
					}
				});
			});
		}

		_onDispose() {
			this._pool.end();
			this._pool = null;
		}

		toString() {
			return '[PooledClientProvider]';
		}
	}

	class PooledClient extends Client {
		constructor(pgClient, preparedStatementMap, releaseCallback) {
			super(pgClient, preparedStatementMap);

			this._releaseCallback = releaseCallback;
		}

		_onDispose() {
			this._releaseCallback();

			this._pgClient = null;
			this._releaseCallback = null;

			logger.info('Disposed [PooledClient] [', this.id, ']');
		}

		toString() {
			return '[PooledClient]';
		}
	}

	return PooledClientProvider;
})();