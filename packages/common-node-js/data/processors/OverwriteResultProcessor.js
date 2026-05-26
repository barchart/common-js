const log4js = require('log4js');

const attributes = require('@barchart/common-js/lang/attributes');

const MutateResultProcessor = require('./MutateResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/processors/OverwriteResultProcessor');

	class OverwriteResultProcessor extends MutateResultProcessor {
		constructor(configuration) {
			super(configuration);
		}

		_processItem(resultItemToProcess, configurationToUse) {
			attributes.write(resultItemToProcess, configurationToUse.propertyName, configurationToUse.overwriteValue);
		}

		toString() {
			return '[OverwriteResultProcessor]';
		}
	}

	return OverwriteResultProcessor;
})();