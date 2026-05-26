const log4js = require('log4js');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/QueryProvider');

	/**
	 * Used by a {@link DataProvider} to generate data.
	 *
	 * @public
	 * @interface
	 * @param {Object} configuration - Used by inheriting class.
	 */
	class QueryProvider {
		constructor(configuration) {
			this._configuration = configuration || {};
		}

		/**
		 * @protected
		 * @ignore
		 */
		_getConfiguration() {
			return this._configuration;
		}

		/**
		 * Executes the query, returning the results as a promise.
		 *
		 * @public
		 * @param {Object} criteria - The criteria needed to execute the query.
		 * @returns {Promise} The query results, as a promise.
		 */
		runQuery(criteria) {
			if (!this.getCriteriaIsValid(criteria)) {
				throw new Error('Unable to run query, the query parameters are invalid.');
			}

			return Promise.resolve()
				.then(() => {
					return this._runQuery(criteria);
				});
		}

		/**
		 * @protected
		 * @ignore
		 */
		_runQuery(criteria) {
			return null;
		}

		/**
		 * Indicates if the criteria could be passed to the {@link QueryProvider#runQuery} function
		 * without causing an error to be thrown.
		 *
		 * @public
		 * @param {Object} criteria
		 * @returns {Boolean}
		 */
		getCriteriaIsValid(criteria) {
			return this._getCriteriaIsValid(criteria);
		}

		/**
		 * @protected
		 * @ignore
		 */
		_getCriteriaIsValid(criteria) {
			return true;
		}

		toString() {
			return '[QueryProvider]';
		}
	}

	return QueryProvider;
})();