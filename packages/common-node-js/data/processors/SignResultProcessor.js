const log4js = require('log4js');

const attributes = require('@barchart/common-js/lang/attributes'),
	is = require('@barchart/common-js/lang/is');

const MutateResultProcessor = require('./MutateResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/processors/SignResultProcessor');

	class SignResultProcessor extends MutateResultProcessor {
		constructor(configuration) {
			super(configuration);
		}

		_processItem(resultItemToProcess, configurationToUse) {
			let propertyValue = attributes.read(resultItemToProcess, configurationToUse.sourcePropertyName);

			if (is.string(propertyValue)) {
				propertyValue = parseFloat(propertyValue);
			}

			if (is.number(propertyValue)) {
				let signValue;

				if (propertyValue === 0) {
					signValue = configurationToUse.targetPropertyValue.zero;
				} else if (propertyValue > 0) {
					signValue = configurationToUse.targetPropertyValue.positive;
				} else if (propertyValue < 0) {
					signValue = configurationToUse.targetPropertyValue.negative;
				}

				attributes.write(resultItemToProcess, configurationToUse.targetPropertyName, signValue);
			}
		}

		toString() {
			return '[SignResultProcessor]';
		}
	}

	return SignResultProcessor;
})();