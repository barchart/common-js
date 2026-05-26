const log4js = require('log4js');

const attributes = require('@barchart/common-js/lang/attributes'),
	is = require('@barchart/common-js/lang/is');

const ResultProcessor = require('./../ResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/processors/FilterEqualsResultProcessor');

	/**
	 * Filters an array to items based on equality checks against
	 * one (or more) of the item's properties.
	 *
	 * @public
	 * @extends ResultProcessor
	 * @param {Object} configuration
	 * @param {string=} configuration.sourceRef - The name of the array to filter. If not supplied, the context is used as the array to filter.
	 * @param {Object[]} configuration.conditions
	 * @param {string} configuration.conditions[].propertyName - The name of property (which must match).
	 * @param {string} configuration.conditions[].value - The actual value which the property must match.
	 * @param {string} configuration.conditions[].valueRef - The name of the property whose value must be matched.
	 * @param {boolen=} configuration.conditions[].inverse - If true, items which are equal are filtered.
	 */
	class FilterEqualsResultProcessor extends ResultProcessor {
		constructor(configuration) {
			super(configuration);
		}

		_process(results) {
			const configuration = this._getConfiguration();

			let returnRef;

			if (is.array(configuration.conditions)) {
				let source;

				if (is.array(results)) {
					source = results;
				} else if (is.string(configuration.sourceRef)) {
					source = attributes.read(results, configuration.sourceRef);
				} else {
					source = [ ];
				}

				returnRef = source.filter((result) => {
					return configuration.conditions.every((condition) => {
						const propertyValue = attributes.read(result, condition.propertyName);

						let valueToMatch;

						if (is.string(condition.valueRef) && attributes.has(results, condition.valueRef)) {
							valueToMatch = attributes.read(results, condition.valueRef);
						} else {
							valueToMatch = condition.value;
						}

						const match = propertyValue === valueToMatch;
						const inverse = is.boolean(condition.inverse) && condition.inverse;

						return match ^ inverse;
					});
				});
			} else {
				returnRef = [ ];
			}

			return returnRef;
		}

		toString() {
			return '[FilterEqualsResultProcessor]';
		}
	}

	return FilterEqualsResultProcessor;
})();