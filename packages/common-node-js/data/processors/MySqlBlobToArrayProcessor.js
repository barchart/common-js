const log4js = require('log4js');

const attributes = require('@barchart/common-js/lang/attributes');

const MutateResultProcessor = require('./MutateResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/processors/MySqlBlobToArrayProcessor');

	class MySqlBlobToArrayProcessor extends MutateResultProcessor {
		constructor(configuration) {
			super(configuration);
		}

		_processItem(resultItemToProcess, configurationToUse) {
			let propertyName = configurationToUse.propertyName;
			let propertyValue = attributes.read(resultItemToProcess, propertyName);

			if (logger.isTraceEnabled()) {
				logger.trace('binary object:', propertyValue);
			}

			propertyValue = propertyValue.toString().split(',');

			if (logger.isTraceEnabled()) {
				logger.trace('array:', propertyValue);
			}

			attributes.write(resultItemToProcess, propertyName, propertyValue);
		}

		toString() {
			return '[MySqlBlobToArrayProcessor]';
		}
	}

	return MySqlBlobToArrayProcessor;
})();