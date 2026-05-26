const log4js = require('log4js');

const is = require('@barchart/common-js/lang/is');

const ResultProcessor = require('./../ResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/processors/EpochResultProcessor');

	/**
	 * Converts a date into an numeric value (milliseconds since epoch).
	 *
	 * @public
	 * @extends ResultProcessor
	 */
	class EpochResultProcessor extends ResultProcessor {
		constructor(configuration) {
			super(configuration);
		}

		_process(results) {
			if (is.date(results)) {
				return results.getTime();
			} else {
				return results;
			}
		}

		toString() {
			return '[EpochResultProcessor]';
		}
	}

	return EpochResultProcessor;
})();