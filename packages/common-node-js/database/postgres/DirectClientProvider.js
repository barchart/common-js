const log4js = require('log4js'),
	pg = require('pg');

const promise = require('@barchart/common-js/lang/promise');

const Client = require('./Client'),
	ClientProvider = require('./ClientProvider');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('common-node/database/postgres/DirectClientProvider');

	/**
	 * A Postgres {@link ClientProvider} which uses a dedicated, individual connections.
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
	class DirectClientProvider extends ClientProvider {
		constructor(host, database, username, password, port, applicationName, ssl) {
			super(host, database, username, password, port, applicationName, ssl);
		}

		_getClient() {
			return promise.build((resolveCallback, rejectCallback) => {
				const configuration = this.getConfiguration();
				const pgClient = new pg.Client(configuration);

				logger.debug('Connecting new [DirectClient] to [', configuration.host, '] [', configuration.database, ']');

				pgClient.connect((e) => {
					if (e) {
						logger.error('Failed to connect [DirectClient] to [', configuration.host, '] [', configuration.database, ']', e);

						rejectCallback(e);
					} else {
						const client = new DirectClient(pgClient);

						logger.info('Connected new [DirectClient] [', client.id, '] to [', configuration.host, '] [', configuration.database, ']');

						resolveCallback(client);
					}
				});
			});
		}

		_onDispose() {
			return;
		}

		toString() {
			return '[DirectClientProvider]';
		}
	}

	class DirectClient extends Client {
		constructor(pgClient) {
			super(pgClient, {});
		}

		_onDispose() {
			this._pgClient.end();
			this._pgClient = null;

			logger.info('Disposed [DirectClient] [', this.id, ']');
		}

		toString() {
			return '[DirectClient]';
		}
	}

	return DirectClientProvider;
})();