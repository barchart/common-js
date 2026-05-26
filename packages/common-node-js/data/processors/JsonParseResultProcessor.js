const log4js = require('log4js');

const is = require('@barchart/common-js/lang/is');

const ResultProcessor = require('./../ResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/processors/JsonParseResultProcessor');

	class JsonParseResultProcessor extends ResultProcessor {
		constructor(configuration) {
			super(configuration);
		}

		_process(results) {
			let returnRef;

			if (is.string(results)) {
				returnRef = JSON.parse(results);
			} else {
				returnRef = results;
			}

			return returnRef;
		}

		toString() {
			return '[JsonParseResultProcessor]';
		}
	}

	return JsonParseResultProcessor;
})();