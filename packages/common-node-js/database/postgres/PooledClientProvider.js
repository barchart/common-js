import * as promise from '@barchart/common-js/lang/promise.js';

import Client from './Client.js';
import ClientProvider from './ClientProvider.js';

import log4js from 'log4js';
import pg from 'pg';

const logger = log4js.getLogger('common-node/database/postgres/PooledClientProvider');

/**
 * A Postgres {@link ClientProvider} which uses a a connection pool.
 *
 * @public
 * @extends {ClientProvider}
 */
export default class PooledClientProvider extends ClientProvider {
	#pool;
	#preparedStatementMap;

	/**
	 * @param {string} host
	 * @param {string} database
	 * @param {string} username
	 * @param {string} password
	 * @param {number=} port
	 * @param {string=} applicationName
	 * @param {*=} ssl
	 */
	constructor(host, database, username, password, port, applicationName, ssl) {
		super(host, database, username, password, port, applicationName, ssl);

		this.#pool = new pg.Pool(this.getConfiguration());
		this.#preparedStatementMap = {};

		this.#pool.on('error', (e, client) => {
			logger.error('Postgres connection pool experienced an error', e);
		});
	}

	_getClient() {
		return promise.build((resolveCallback, rejectCallback) => {
			const configuration = this.getConfiguration();

			logger.debug('Creating new [PooledClient] for [', configuration.host, '] [', configuration.database, ']');

			this.#pool.connect((e, pgClient, releaseCallback) => {
				if (e) {
					logger.error('Failed to connect [PooledClient] to [', configuration.host, '] [', configuration.database, ']', e);

					rejectCallback(e);
				} else {
					const client = new PooledClient(pgClient, this.#preparedStatementMap, releaseCallback);

					logger.info('Created new [PooledClient] [', client.id, '] for [', configuration.host, '] [', configuration.database, ']');

					resolveCallback(client);
				}
			});
		});
	}

	_onDispose() {
		this.#pool.end();
		this.#pool = null;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[PooledClientProvider]';
	}
}

class PooledClient extends Client {
	#releaseCallback;

	constructor(pgClient, preparedStatementMap, releaseCallback) {
		super(pgClient, preparedStatementMap);

		this.#releaseCallback = releaseCallback;
	}

	/**
	 * @protected
	 * @override
	 */
	_onDispose() {
		this.#releaseCallback();

		this.#releaseCallback = null;

		logger.info('Disposed [PooledClient] [', this.id, ']');
	}

	toString() {
		return '[PooledClient]';
	}
}
