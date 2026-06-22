import * as assert from '@barchart/common-js/lang/assert.js';

import Disposable from '@barchart/common-js/lang/Disposable.js';

/**
 * @typedef {import('./Client.js').default} Client
 */

/**
 * An abstract contract for generating MySQL {@link Client} instances.
 *
 * @public
 * @abstract
 */
export default class ClientProvider extends Disposable {
	#configuration;

	/**
	 * @param {string} host
	 * @param {string} database
	 * @param {string} username
	 * @param {string} password
	 * @param {number=} port
	 * @param {string=} applicationName
	 * @param {string=} charset
	 */
	constructor(host, database, username, password, port, applicationName, charset) {
		super();

		assert.argumentIsRequired(host, 'host', String);
		assert.argumentIsRequired(database, 'database', String);
		assert.argumentIsRequired(username, 'username', String);
		assert.argumentIsRequired(password, 'password', String);
		assert.argumentIsOptional(port, 'port', Number);
		assert.argumentIsOptional(applicationName, 'applicationName', String);
		assert.argumentIsOptional(charset, 'charset', String);

		this.#configuration = {
			host: host,
			port: port || 3306,
			database: database,
			user: username,
			password: password,
			multipleStatements: true
		};

		if (charset) {
			this.#configuration.charset = charset;
		}
	}

	/**
	 * Creates a new Postgres {@link Client} instance.
	 *
	 * @public
	 * @async
	 * @returns {Promise<Client>}
	 */
	async getClient() {
		if (this.disposed) {
			throw `Unable to get MySQL client, the ${this.toString()} has been disposed`;
		}

		return this._getClient();
	}

	/**
	 * @protected
	 * @returns {Client|Promise<Client>}
	 */
	_getClient() {
		return null;
	}

	/**
	 * Returns the database configuration (e.g. host, port, etc.).
	 *
	 * @public
	 * @returns {object}
	 */
	getConfiguration() {
		return Object.assign({ }, this.#configuration);
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[ClientProvider]';
	}
}
