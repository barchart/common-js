const log4js = require('log4js');

const is = require('@barchart/common-js/lang/is');

const ResultProcessor = require('./../ResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/processors/CoalesceResultProcessor');

	/**
	 * Returns returns the first value that is not null (or undefined) in
	 * an array.
	 *
	 * @public
	 * @extends ResultProcessor
	 * @param {object} configuration
	 */
	class CoalesceResultProcessor extends ResultProcessor {
		constructor(configuration) {
			super(configuration);
		}

		_process(results) {
			let values;

			if (is.array(results)) {
				values = results;
			} else {
				values = [ ];
			}

			return values.find(v => !is.null(v) && !is.undefined(v));
		}

		toString() {
			return '[CoalesceResultProcessor]';
		}
	}

	return CoalesceResultProcessor;
})();