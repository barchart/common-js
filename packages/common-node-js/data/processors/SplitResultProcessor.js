const log4js = require('log4js');

const attributes = require('@barchart/common-js/lang/attributes'),
	is = require('@barchart/common-js/lang/is');

const MutateResultProcessor = require('./MutateResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/processors/SplitResultProcessor');

	class SplitResultProcessor extends MutateResultProcessor {
		constructor(configuration) {
			super(configuration);
		}

		_processItem(resultItemToProcess, configurationToUse) {
			const configuration = this._getConfiguration();

			const propertyName = configurationToUse.propertyName;
			const propertyValue = attributes.read(resultItemToProcess, propertyName);

			if (is.string(propertyValue)) {
				let splitResult;

				if (is.string(configurationToUse.separatorString)) {
					splitResult = propertyValue.split(configurationToUse.separatorString);
				} else if (is.string(configurationToUse.separatorRegex)) {
					splitResult = propertyValue.split(new RegExp(configurationToUse.separatorRegex));
				} else {
					splitResult = propertyValue;
				}

				attributes.write(resultItemToProcess, propertyName, splitResult);
			}

			return resultItemToProcess;
		}

		toString() {
			return '[SplitResultProcessor]';
		}
	}

	return SplitResultProcessor;
})();