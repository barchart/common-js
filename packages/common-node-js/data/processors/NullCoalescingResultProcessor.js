const log4js = require('log4js');

const attributes = require('@barchart/common-js/lang/attributes');

const MutateResultProcessor = require('./MutateResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/processors/NullCoalescingResultProcessor');

	/**
	 * Replaces all null values.
	 *
	 * @public
	 * @extends MutateResultProcessor
	 * @param {object} configuration
	 * @param {string} configuration.propertyName - The property to check.
	 * @param {object} configuration.replaceValue - The value to assign when the current value is null.
	 */
	class NullCoalescingResultProcessor extends MutateResultProcessor {
		constructor(configuration) {
			super(configuration);
		}

		_processItem(resultItemToProcess, configurationToUse) {
			const propertyName = configurationToUse.propertyName;
			const propertyValue = attributes.read(resultItemToProcess, propertyName);

			if (propertyValue === null) {
				attributes.write(resultItemToProcess, propertyName, configurationToUse.replaceValue);
			}
		}

		toString() {
			return '[NullCoalescingResultProcessor]';
		}
	}

	return NullCoalescingResultProcessor;
})();