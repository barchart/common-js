import * as assert from '@barchart/common-js/lang/assert.js';
import * as promise from '@barchart/common-js/lang/promise.js';

import Disposable from '@barchart/common-js/lang/Disposable.js';

import log4js from 'log4js';
import * as uuid from 'uuid';

const logger = log4js.getLogger('common-node/database/mysql/Client');

let queryCounter = 0;

/**
 * An abstract class for executing queries against a MySQL database.
 *
 * @public
 * @abstract
 */
export default class Client extends Disposable {
	#connection;
	#id;

	/**
	 * @param {object} connection - The connection.
	 */
	constructor(connection) {
		super();

		assert.argumentIsRequired(connection, 'connection', Object);

		this.#id = uuid.v4();
		this.#connection = connection;
	}

	/**
	 * A unique identifier to identify the client.
	 *
	 * @public
	 * @returns {string}
	 */
	get id() {
		return this.#id;
	}

	/**
	 * Executes a query.
	 *
	 * @public
	 * @async
	 * @param {string} query
	 * @param {Array=} parameters
	 * @param {string=} name
	 * @returns {Promise<object[]>}
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

			logger.debug('Executing query [', queryCount, '] from client [', this.#id, ']');

			this.#connection.query(query, parameters || [ ], (e, result) => {
				if (e) {
					logger.debug('Query [', queryCount, '] from client [', this.#id, '] failed');

					rejectCallback(e);
				} else {
					logger.debug('Query [', queryCount, '] from client [', this.#id, '] finished');

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
	 * @param {boolean} graceful
	 * @returns {Promise<void>}
	 */
	async shutdown(graceful) {
		if (this.disposed) {
			throw new Error(`Unable to shutdown, the [ ${this.toString()} ] has been disposed`);
		}

		if (this.#connection === null) {
			throw new Error(`Unable to shutdown, the [ ${this.toString()} ] has been shutdown`);
		}

		assert.argumentIsRequired(graceful, 'graceful', Boolean);

		const connection = this.#connection;
		this.#connection = null;

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

	/**
	 * @protected
	 * @override
	 */
	_onDispose() {
		if (this.#connection !== null) {
			this.#connection.destroy();

			this.#connection = null;
		}

		logger.info(`Disposed [ ${this.toString()} ] [ ${this.id} ]`);
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[Client]';
	}
}
