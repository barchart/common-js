const log4js = require('log4js');

const attributes = require('@barchart/common-js/lang/attributes'),
	is = require('@barchart/common-js/lang/is');

const ResultProcessor = require('./../ResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/processors/ScalarResultProcessor');

	/**
	 * If the context is an array, extracts and returns the first item from the
	 * array. If the array has more than one item, an error is thrown.
	 *
	 * @public
	 * @extends ResultProcessor
	 * @param {object} configuration
	 */
	class ScalarResultProcessor extends ResultProcessor {
		constructor(configuration) {
			super(configuration);
		}

		_process(results) {
			let result;

			if (is.array(results)) {
				if (results.length === 0) {
					result = undefined;
				} else if (results.length === 1) {
					result = results[0];
				} else {
					throw new Error('Data provider returned multiple results when scalar value was expected.');
				}
			} else {
				result = results;
			}

			return result;
		}

		toString() {
			return '[ScalarResultProcessor]';
		}
	}

	return ScalarResultProcessor;
})();