const log4js = require('log4js');

const attributes = require('@barchart/common-js/lang/attributes'),
	is = require('@barchart/common-js/lang/is');

const ResultProcessor = require('./../ResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/processors/SliceResultProcessor');

	class SliceResultProcessor extends ResultProcessor {
		constructor(configuration) {
			super(configuration);
		}

		_process(results) {
			const configuration = this._getConfiguration();

			let result;

			let start = configuration.start;
			let end = configuration.end;

			if (is.number(start) && is.array(results)) {
				if (is.number(end)) {
					end = configuration.end;
				} else {
					end = undefined;
				}

				result = results.slice(start, end);
			} else {
				result = results;
			}

			return result;
		}

		toString() {
			return '[SliceResultProcessor]';
		}
	}

	return SliceResultProcessor;
})();