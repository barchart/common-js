const log4js = require('log4js');

const assert = require('@barchart/common-js/lang/assert');

const QueryProvider = require('./QueryProvider'),
	ResultProcessor = require('./ResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/DataProvider');

	/**
	 * Generates data using a {@link DataProvider} and processes the data
	 * with a {@link ResultProcessor}.
	 *
	 * @public
	 * @param {QueryProvider} queryProvider - The query provider.
	 * @param {ResultProcessor} resultProcessor - The result processor.
	 */
	class DataProvider {
		constructor(queryProvider, resultProcessor) {
			assert.argumentIsRequired(queryProvider, 'queryProvider', QueryProvider, 'QueryProvider');
			assert.argumentIsRequired(resultProcessor, 'resultProcessor', ResultProcessor, 'ResultProcessor');

			this._queryProvider = queryProvider;
			this._resultProcessor = resultProcessor;
		}

		/**
		 * Invokes the {@link QueryProvider} and processes results with
		 * the {@link ResultProcessor}.
		 *
		 * @public
		 * @param {Object} criteria - Used to customize the query.
		 * @returns {Promise} The processed output, as a promise.
		 */
		getData(criteria) {
			return this._queryProvider.runQuery(criteria)
				.then((data) => {
					return this._resultProcessor.process(data);
				});
		}

		/**
		 * Indicates if the data could be passed to the {@link getData} function
		 * without causing an error to be thrown.
		 *
		 * @public
		 * @param {Object} criteria
		 * @returns {Boolean}
		 */
		getCriteriaIsValid(criteria) {
			return this._queryProvider.getCriteriaIsValid(criteria);
		}

		toString() {
			return `[DataProvider (QueryProvider=${this._queryProvider.toString()}, ResultProcessor=${this._resultProcessor.toString()}]`;
		}
	}

	return DataProvider;
})();