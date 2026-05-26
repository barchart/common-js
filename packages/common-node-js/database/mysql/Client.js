const log4js = require('log4js');

const uuid = require('uuid');

const assert = require('@barchart/common-js/lang/assert'),
	Disposable = require('@barchart/common-js/lang/Disposable'),
	promise = require('@barchart/common-js/lang/promise');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('common-node/database/mysql/Client');

	let queryCounter = 0;

	/**
	 * An abstract class for executing queries against a MySQL database.
	 *
	 * @public
	 * @abstract
	 */
	class Client extends Disposable {
		constructor(connection) {
			super();

			assert.argumentIsRequired(connection, 'connection', Object);

			this._id = uuid.v4();
			this._connection = connection;
		}

		/**
		 * A unique identifier to identify the client.
		 *
		 * @public
		 * @returns {String}
		 */
		get id() {
			return this._id;
		}

		/**
		 * Executes a query.
		 *
		 * @public
		 * @async
		 * @param {String} query
		 * @param {Array=} parameters
		 * @param {String=} name
		 * @returns {Promise<Object[]>}
		 */
		async query(query, parameters, name) {
			if (this.disposed) {
				throw new Error(`Unable to execute query, the ${this.toString()} has been disposed`);
			}

			assert.argumentIsRequired(query, 'query', String);
			assert.argumentIsOptional(name, 'name', String);

			return promise.build((resolveCallback, rejectCallback) => {
				queryCounter = queryCounter + 1;

				const queryCount = queryCounter;

				logger.debug('Executing query [', queryCount, '] from client [', this._id, ']');

				this._connection.query(query, parameters || [ ], (e, result) => {
					if (e) {
						logger.debug('Query [', queryCount, '] from client [', this._id, '] failed');

						rejectCallback(e);
					} else {
						logger.debug('Query [', queryCount, '] from client [', this._id, '] finished');

						resolveCallback(result);
					}
				});
			});
		}

		/**
		 * Finalizes instance operations and disposes instance. If the graceful parameter is true, any outstanding
		 * queries will be completed.
		 *
		 * @public
		 * @async
		 * @param {Boolean} graceful
		 * @returns {Promise<void>}
		 */
		async shutdown(graceful) {
			if (this.disposed) {
				throw new Error(`Unable to shutdown, the [ ${this.toString()} ] has been disposed`);
			}

			if (this._connection === null) {
				throw new Error(`Unable to shutdown, the [ ${this.toString()} ] has been shutdown`);
			}

			assert.argumentIsRequired(graceful, 'graceful', Boolean);

			const connection = this._connection;
			this._connection = null;

			this.dispose();

			let shutdownPromise;

			if (graceful) {
				shutdownPromise = new Promise((resolve, reject) => {
					connection.end((error) => {
						if (error) {
							reject(error);
						}

						logger.info(`Shutdown [ ${this.toString()} ] [ ${this.id} ] gracefully`);

						resolve();
					});
				});
			} else {
				shutdownPromise = new Promise((resolve) => {
					connection.destroy();

					logger.info(`Shutdown [ ${this.toString()} ] [ ${this.id} ] immediately`);

					resolve();
				});
			}

			return shutdownPromise;
		}

		_onDispose() {
			if (this._connection !== null) {
				this._connection.destroy();

				this._connection = null;
			}

			logger.info(`Disposed [ ${this.toString()} ] [ ${this.id} ]`);
		}

		toString() {
			return '[Client]';
		}
	}

	return Client;
})();