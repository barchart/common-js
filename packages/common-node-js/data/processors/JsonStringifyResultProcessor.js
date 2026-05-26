const log4js = require('log4js');

const is = require('@barchart/common-js/lang/is');

const ResultProcessor = require('./../ResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/processors/JsonStringifyResultProcessor');

	class JsonStringifyResultProcessor extends ResultProcessor {
		constructor(configuration) {
			super(configuration);
		}

		_process(results) {
			let returnRef;

			if (is.object(results) || is.array(results)) {
				returnRef = JSON.stringify(results);
			} else {
				returnRef = results;
			}

			return returnRef;
		}

		toString() {
			return '[JsonStringifyResultProcessor]';
		}
	}

	return JsonStringifyResultProcessor;
})();