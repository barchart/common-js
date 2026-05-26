const log4js = require('log4js');

const attributes = require('@barchart/common-js/lang/attributes'),
	is = require('@barchart/common-js/lang/is');

const MutateResultProcessor = require('./MutateResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/processors/UppercaseResultProcessor');

	class MutateStringResultProcessor extends MutateResultProcessor {
		constructor(configuration) {
			super(configuration);
		}

		_processItem(resultItemToProcess, configurationToUse) {
			const propertyName = configurationToUse.propertyName;

			if (attributes.has(resultItemToProcess, propertyName)) {
				const propertyValue = attributes.read(resultItemToProcess, propertyName);

				let convertedValue;

				const processString = (value) => {
					if (is.string(value)) {
						return this._processString(value);
					} else {
						return value;
					}
				};

				if (is.array(propertyValue)) {
					convertedValue = propertyValue.map(processString);
				} else {
					convertedValue = processString(propertyValue);
				}

				attributes.write(resultItemToProcess, propertyName, convertedValue);
			}
		}

		_processString(value) {
			return value;
		}

		toString() {
			return '[MutateStringResultProcessor]';
		}
	}

	return MutateStringResultProcessor;
})();