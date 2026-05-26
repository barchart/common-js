const log4js = require('log4js');

const attributes = require('@barchart/common-js/lang/attributes'),
	is = require('@barchart/common-js/lang/is');

const ResultProcessor = require('./../ResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/processors/FilterRegexResultProcessor');

	/**
	 * Filters an array to items that have one (or more) properties that
	 * match a regular expression.
	 *
	 * @public
	 * @extends ResultProcessor
	 * @param {Object} configuration
	 * @param {Object[]} configuration.conditions
	 * @param {string} configuration.conditions[].propertyName - The name of property to test the regular expression on.
	 * @param {string} configuration.conditions[].expression - The regular expression used to test the property's value.
	 * @param {boolen=} configuration.conditions[].inverse - If true, items which match are filtered.
	 */
	class FilterRegexResultProcessor extends ResultProcessor {
		constructor(configuration) {
			super(configuration);
		}

		_process(results) {
			const configuration = this._getConfiguration();

			let returnRef;

			if (is.array(results) && is.array(configuration.conditions)) {
				returnRef = results.filter((result) => {
					return configuration.conditions.every((condition) => {
						let returnVal;

						if (is.string(condition.propertyName) && is.string(condition.expression) && attributes.has(result, condition.propertyName)) {
							const expression = new RegExp(condition.expression);

							const match = expression.test(attributes.read(result, condition.propertyName));
							const inverse = is.boolean(condition.inverse) && condition.inverse;

							returnVal = match ^ inverse;
						} else {
							returnVal = false;
						}

						return returnVal;
					});
				});
			} else {
				returnRef = results;
			}

			return returnRef;
		}

		toString() {
			return '[FilterRegexResultProcessor]';
		}
	}

	return FilterRegexResultProcessor;
})();