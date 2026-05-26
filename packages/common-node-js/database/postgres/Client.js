const log4js = require('log4js');

const uuid = require('uuid');

const assert = require('@barchart/common-js/lang/assert'),
	 Disposable = require('@barchart/common-js/lang/Disposable'),
	 is = require('@barchart/common-js/lang/is'),
	 promise = require('@barchart/common-js/lang/promise');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('common-node/database/postgres/Client');

	let queryCounter = 0;

	/**
	 * An abstract class for executing queries against a Postgres database.
	 *
	 * @public
	 * @abstract
	 */
	class Client extends Disposable {
		constructor(pgClient, preparedStatementMap) {
			super();

			assert.argumentIsRequired(pgClient, 'pgClient');
			assert.argumentIsRequired(preparedStatementMap, 'preparedStatementMap');

			this._id = uuid.v4();
			this._pgClient = pgClient;
			this._preparedStatementMap = preparedStatementMap;
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
				return Promise.reject(`Unable to execute Postgres query, the ${this.toString()} has been disposed`);
			}

			assert.argumentIsRequired(query, 'query', String);
			assert.argumentIsOptional(name, 'name', String);

			return promise.build((resolveCallback, rejectCallback) => {
				const queryObject = {
					values: parameters || []
				};

				if (is.string(name)) {
					queryObject.name = name;

					if (!this._preparedStatementMap.hasOwnProperty(name)) {
						this._preparedStatementMap[name] = query;
					}

					queryObject.text = this._preparedStatementMap[name];
				} else {
					queryObject.text = query;
				}

				queryCounter = queryCounter + 1;

				const queryCount = queryCounter;

				logger.debug('Executing query [', queryCount, '] from client [', this._id, ']');
				logger.trace('Executing query [', queryCount, '] from client [', this._id, ']', queryObject);

				this._pgClient.query(queryObject, (err, result) => {
					if (err) {
						logger.debug('Query [', queryCount, '] from client [', this._id, '] failed ');

						rejectCallback(err);
					} else {
						logger.debug('Query [', queryCount, '] from client [', this._id, '] finished');

						resolveCallback(result);
					}
				});
			});
		}

		toString() {
			return '[Client]';
		}
	}

	return Client;
})();