const log4js = require('log4js');

const attributes = require('@barchart/common-js/lang/attributes'),
	is = require('@barchart/common-js/lang/is');

const MutateResultProcessor = require('./MutateResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/processors/CountResultProcessor');

	class CountResultProcessor extends MutateResultProcessor {
		constructor(configuration) {
			super(configuration);
		}

		_processItem(resultItemToProcess, configurationToUse) {
			if (!(is.string(configurationToUse.sourcePropertyName) && attributes.has(resultItemToProcess, configurationToUse.sourcePropertyName))) {
				return;
			}

			let equalsPredicate;

			if (is.object(configurationToUse.criteria) && is.object(configurationToUse.criteria.equals)) {
				equalsPredicate = (item) => {
					return Object.keys(configurationToUse.criteria.equals)
						.every((propertyName) => {
							const expectedValue = configurationToUse.criteria.equals[propertyName];

							return attributes.has(item, propertyName) && attributes.read(item, propertyName) === expectedValue;
						});
				};
			} else {
				equalsPredicate = (item) => {
					return true;
				};
			}

			const objectToCount = attributes.read(resultItemToProcess, configurationToUse.sourcePropertyName);

			const count = objectToCount.reduce((current, item) => {
				let returnVal;

				if (equalsPredicate(item)) {
					returnVal = current + 1;
				} else {
					returnVal = current;
				}

				return returnVal;
			}, 0);

			let targetPropertyName;

			if (is.string(configurationToUse.targetPropertyName)) {
				targetPropertyName = configurationToUse.targetPropertyName;
			} else {
				targetPropertyName = configurationToUse.sourcePropertyName;
			}

			attributes.write(resultItemToProcess, targetPropertyName, count);
		}

		toString() {
			return '[CountResultProcessor]';
		}
	}

	return CountResultProcessor;
})();