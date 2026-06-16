import * as promise from '@barchart/common-js/lang/promise.js';

import Client from './Client.js';
import ClientProvider from './ClientProvider.js';

import log4js from 'log4js';
import JavascriptClient from 'pg/lib/client';

const logger = log4js.getLogger('common-node/database/postgres/DirectClientProviderSimple');

/**
 * A Postgres {@link ClientProvider} which uses a dedicated, individual connections.
 * Connections implemented with pure JavaScript — native bindings are not used. This
 * may be slower, but it's easier to include with a WebPack deployment (e.g. for use
 * with Lambda Functions).
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
export default class DirectClientProviderSimple extends ClientProvider {
	constructor(host, database, username, password, port, applicationName, ssl) {
		super(host, database, username, password, port, applicationName, ssl);
	}

	_getClient() {
		return promise.build((resolveCallback, rejectCallback) => {
			const configuration = this.getConfiguration();
			const pgClient = new JavascriptClient(this.getConfiguration());

			logger.debug('Connecting new [DirectClientSimple] to [', configuration.host, '] [', configuration.database, ']');

			pgClient.connect((e) => {
				if (e) {
					logger.error('Failed to connect [DirectClientSimple] to [', configuration.host, '] [', configuration.database, ']', e);

					rejectCallback(e);
				} else {
					const client = new DirectClient(pgClient);

					logger.info('Connected new [DirectClientSimple] [', client.id, '] to [', configuration.host, '] [', configuration.database, ']');

					resolveCallback(client);
				}
			});
		});
	}

	_onDispose() {
		return;
	}

	toString() {
		return '[DirectClientProviderSimple]';
	}
}

class DirectClient extends Client {
	constructor(pgClient) {
		super(pgClient, {});
	}

	_onDispose() {
		this._pgClient.end();
		this._pgClient = null;

		logger.info('Disposed [DirectClientSimple] [', this.id, ']');
	}

	toString() {
		return '[DirectClientSimple]';
	}
}
