import * as promise from '@barchart/common-js/lang/promise.js';

import Client from './Client.js';
import ClientProvider from './ClientProvider.js';

import log4js from 'log4js';
import mysql from 'mysql';

const logger = log4js.getLogger('common-node/database/mysql/DirectClientProvider');

/**
 * A MySQL {@link ClientProvider} which uses a dedicated, individual connections.
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
	 * @param {string=} charset - The charset.
	 */
	constructor(host, database, username, password, port, applicationName, charset) {
		super(host, database, username, password, port, applicationName, charset);
	}

	/**
	 * @protected
	 * @override
	 * @returns {Promise<Client>}
	 */
	_getClient() {
		return promise.build((resolveCallback, rejectCallback) => {
			const configuration = this.getConfiguration();
			const connection = mysql.createConnection(configuration);

			logger.debug('Connecting new [DirectClient] to [', configuration.host, '] [', configuration.database, ']');

			connection.connect((e) => {
				if (e) {
					logger.error('Failed to connect [DirectClient] to [', configuration.host, '] [', configuration.database, ']', e);

					rejectCallback(e);
				} else {
					const client = new DirectClient(connection);

					logger.info('Connected new [DirectClient] [', client.id, '] to [', configuration.host, '] [', configuration.database, ']');

					resolveCallback(client);
				}
			});
		});
	}

	/**
	 * @protected
	 * @override
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
	/**
	 * @param {*} connection - The connection.
	 */
	constructor(connection) {
		super(connection);
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
