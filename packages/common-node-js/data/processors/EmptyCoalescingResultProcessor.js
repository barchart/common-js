const log4js = require('log4js');

const attributes = require('@barchart/common-js/lang/attributes'),
	is = require('@barchart/common-js/lang/is');

const MutateResultProcessor = require('./MutateResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/processors/EmptyCoalescingResultProcessor');

	class EmptyCoalescingResultProcessor extends MutateResultProcessor {
		constructor(configuration) {
			super(configuration);
		}

		_processItem(resultItemToProcess, configurationToUse) {
			const propertyName = configurationToUse.propertyName;

			let replace;

			if (attributes.has(resultItemToProcess, propertyName)) {
				const propertyValue = attributes.read(resultItemToProcess, propertyName);

				replace = is.null(propertyValue) || is.undefined(propertyValue) || propertyValue === '';
			} else {
				replace = true;
			}

			if (replace) {
				let replaceValue;

				if (is.string(configurationToUse.replaceValueRef)) {
					replaceValue = attributes.read(resultItemToProcess, configurationToUse.replaceValueRef);
				} else {
					replaceValue = configurationToUse.replaceValue;
				}

				attributes.write(resultItemToProcess, propertyName, replaceValue);
			}
		}

		toString() {
			return '[EmptyCoalescingResultProcessor]';
		}
	}

	return EmptyCoalescingResultProcessor;
})();