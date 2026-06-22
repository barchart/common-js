import * as assert from '@barchart/common-js/lang/assert.js';
import * as is from '@barchart/common-js/lang/is.js';
import * as promise from '@barchart/common-js/lang/promise.js';

import Disposable from '@barchart/common-js/lang/Disposable.js';

import log4js from 'log4js';
import * as uuid from 'uuid';

const logger = log4js.getLogger('common-node/database/postgres/Client');

let queryCounter = 0;

/**
 * An abstract class for executing queries against a Postgres database.
 *
 * @public
 * @abstract
 */
export default class Client extends Disposable {
	#id;
	#pgClient;
	#preparedStatementMap;

	/**
	 * @param {*} pgClient
	 * @param {*} preparedStatementMap
	 */
	constructor(pgClient, preparedStatementMap) {
		super();

		assert.argumentIsRequired(pgClient, 'pgClient');
		assert.argumentIsRequired(preparedStatementMap, 'preparedStatementMap');

		this.#id = uuid.v4();
		this.#pgClient = pgClient;
		this.#preparedStatementMap = preparedStatementMap;
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
			throw `Unable to execute Postgres query, the ${this.toString()} has been disposed`;
		}

		assert.argumentIsRequired(query, 'query', String);
		assert.argumentIsOptional(name, 'name', String);

		return promise.build((resolveCallback, rejectCallback) => {
			const queryObject = {
				values: parameters || []
			};

			if (is.string(name)) {
				queryObject.name = name;

				if (!this.#preparedStatementMap.hasOwnProperty(name)) {
					this.#preparedStatementMap[name] = query;
				}

				queryObject.text = this.#preparedStatementMap[name];
			} else {
				queryObject.text = query;
			}

			queryCounter = queryCounter + 1;

			const queryCount = queryCounter;

			logger.debug('Executing query [', queryCount, '] from client [', this.#id, ']');
			logger.trace('Executing query [', queryCount, '] from client [', this.#id, ']', queryObject);

			this.#pgClient.query(queryObject, (err, result) => {
				if (err) {
					logger.debug('Query [', queryCount, '] from client [', this.#id, '] failed ');

					rejectCallback(err);
				} else {
					logger.debug('Query [', queryCount, '] from client [', this.#id, '] finished');

					resolveCallback(result);
				}
			});
		});
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
