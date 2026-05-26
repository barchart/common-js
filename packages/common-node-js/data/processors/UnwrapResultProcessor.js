const log4js = require('log4js');

const attributes = require('@barchart/common-js/lang/attributes'),
	is = require('@barchart/common-js/lang/is');

const ResultProcessor = require('./../ResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/processors/UnwrapResultProcessor');

	class UnwrapResultProcessor extends ResultProcessor {
		constructor(configuration) {
			super(configuration);
		}

		_process(results) {
			const configuration = this._getConfiguration();
			const propertyName = configuration.propertyName;

			let returnRef;

			if (is.string(propertyName) && propertyName.length !== 0) {
				returnRef = attributes.read(results, propertyName);
			} else {
				returnRef = results;
			}

			return returnRef;
		}

		toString() {
			return '[UnwrapResultProcessor]';
		}
	}

	return UnwrapResultProcessor;
})();