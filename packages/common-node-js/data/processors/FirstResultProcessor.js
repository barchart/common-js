const log4js = require('log4js');

const is = require('@barchart/common-js/lang/is');

const ResultProcessor = require('./../ResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/processors/FirstResultProcessor');

	/**
	 * Accepts an array of items and returns the first item in the array.
	 *
	 * @public
	 * @extends ResultProcessor
	 * @param {object} configuration
	 */
	class FirstResultProcessor extends ResultProcessor {
		constructor(configuration) {
			super(configuration);
		}

		_process(results) {
			let result;

			if (is.array(results)) {
				if (results.length !== 0) {
					result = results[0];
				} else {
					result = undefined;
				}
			} else {
				result = results;
			}

			return result;
		}

		toString() {
			return '[FirstResultProcessor]';
		}
	}

	return FirstResultProcessor;
})();