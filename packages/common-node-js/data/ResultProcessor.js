const log4js = require('log4js');

const assert = require('@barchart/common-js/lang/assert');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/ResultProcessor');

	/**
	 * Used by a {@link DataProvider} to process the output of a {@link QueryProvider}.
	 * It is important to note that the output may, but is not required to be, the
	 * same as the input.
	 *
	 * @public
	 * @interface
	 * @param {Object} configuration - Used by inheriting class.
	 */
	class ResultProcessor {
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
		 * Processes the results, returning a promise.
		 *
		 * @public
		 * @param {Object} results - The data to process.
		 * @returns {Promise} The processed output, as a promise.
		 */
		process(results) {
			return Promise.resolve()
				.then(() => {
					return this._process(results);
				});
		}

		/**
		 * @protected
		 * @ignore
		 */
		_process(results) {
			return results;
		}

		toString() {
			return '[ResultProcessor]';
		}

		/**
		 * Wraps a {@link ResultProcessor} in a function that returns the result
		 * of the wrapped instance's {@link ResultProcessor#process} function.
		 *
		 * @public
		 * @param {ResultProcessor} resultProcessor - The {@link ResultProcessor} to wrap.
		 * @returns {Function}
		 */
		static toFunction(resultProcessor) {
			assert.argumentIsRequired(resultProcessor, 'resultProcessor', ResultProcessor, 'ResultProcessor');

			return (results) => {
				return resultProcessor.process(results);
			};
		}
	}

	return ResultProcessor;
})();