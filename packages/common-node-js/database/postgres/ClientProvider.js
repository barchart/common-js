const assert = require('@barchart/common-js/lang/assert'),
	Disposable = require('@barchart/common-js/lang/Disposable');

module.exports = (() => {
	'use strict';

	/**
	 * An abstract contract for generating Postgres {@link Client} instances.
	 *
	 * @public
	 * @abstract
	 * @param {String} host
	 * @param {String} database
	 * @param {String} username
	 * @param {String} password
	 * @param {Number=} port
	 * @param {String=} applicationName
	 * @param {*=} ssl
	 */
	class ClientProvider extends Disposable {
		constructor(host, database, username, password, port, applicationName, ssl) {
			super();

			assert.argumentIsRequired(host, 'host', String);
			assert.argumentIsRequired(database, 'database', String);
			assert.argumentIsRequired(username, 'username', String);
			assert.argumentIsRequired(password, 'password', String);
			assert.argumentIsOptional(port, 'port', Number);
			assert.argumentIsOptional(applicationName, 'applicationName', String);
			assert.argumentIsOptional(ssl, 'ssl');

			this._configuration = {
				host: host,
				port: port || 5432,
				database: database,
				user: username,
				password: password,
				application_name: applicationName || 'pg-javascript-client'
			};

			if (ssl) {
				this._configuration.ssl = ssl;
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
			return Promise.resolve()
				.then(() => {
					if (this.disposed) {
						return Promise.reject(`Unable to get Postgres client, the ${this.toString()} has been disposed`);
					}

					return this._getClient();
				});
		}

		_getClient() {
			return null;
		}

		/**
		 * Returns the database configuration (e.g. host, port, etc).
		 *
		 * @public
		 * @returns {Object}
		 */
		getConfiguration() {
			return Object.assign({ }, this._configuration);
		}

		toString() {
			return '[ClientProvider]';
		}
	}

	return ClientProvider;
})();