const log4js = require('log4js');

const is = require('@barchart/common-js/lang/is');

const ResultProcessor = require('./../ResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/processors/CompactResultProcessor');

	/**
	 * Processes an array, returning a new array containing any items
	 * from the original array that are not null or undefined.
	 *
	 * @public
	 * @extends ResultProcessor
	 * @param {object} configuration
	 */
	class CompactResultProcessor extends ResultProcessor {
		constructor(configuration) {
			super(configuration);
		}

		_process(results) {
			let values;

			if (is.array(results)) {
				values = results.filter(r => !is.null(r) && !is.undefined(r));
			} else {
				values = [ ];
			}

			return values;
		}

		toString() {
			return '[CompactResultProcessor]';
		}
	}

	return CompactResultProcessor;
})();