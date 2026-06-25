import * as promise from '@barchart/common-js/lang/promise.js';

import Client from './Client.js';
import ClientProvider from './ClientProvider.js';

import log4js from 'log4js';
import pg from 'pg';

const logger = log4js.getLogger('common-node/database/postgres/DirectClientProvider');

/**
 * A Postgres {@link ClientProvider} which uses a dedicated, individual connections.
 *
 * @public
 * @extends {ClientProvider}
 */
export default class DirectClientProvider extends ClientProvider {
	/**
	 * @param {string} host - The host.
	 * @param {string} database - The database.
	 * @param {string} username - The username.
	 * @param {string} password - The password.
	 * @param {number=} port - The port.
	 * @param {string=} applicationName - The application name.
	 * @param {*=} ssl - The ssl.
	 */
	constructor(host, database, username, password, port, applicationName, ssl) {
		super(host, database, username, password, port, applicationName, ssl);
	}

	/**
	 * Returns the client.
	 *
	 * @protected
	 * @returns {*}
	 */
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

	/**
	 * Runs disposal logic.
	 *
	 * @protected
	 * @returns {*}
	 */
	_onDispose() {
		return;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[DirectClientProvider]';
	}
}

/**
 * Provides direct client behavior.
 */
class DirectClient extends Client {
	#pgClient;

	/**
	 * @param {*} pgClient - The pg client.
	 */
	constructor(pgClient) {
		super(pgClient, {});
	}

	/**
	 * @protected
	 * @override
	 */
	_onDispose() {
		this.#pgClient.end();
		this.#pgClient = null;

		logger.info('Disposed [DirectClient] [', this.id, ']');
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[DirectClient]';
	}
}
