const log4js = require('log4js'),
	moment = require('moment');

const attributes = require('@barchart/common-js/lang/attributes'),
	is = require('@barchart/common-js/lang/is');

const ResultProcessor = require('./../ResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/processors/FilterContainsResultProcessor');

	/**
	 * Filters an array to items which have an "inner" array that which contains
	 * a single value, one value for a set of possible values, or all values from
	 * a list of values.
	 *
	 * @public
	 * @extends ResultProcessor
	 * @param {object} configuration
	 * @param {string} configuration.outerArrayPropertyName - The name of the array to filter.
	 * @param {string} configuration.innerArrayPropertyName - The name of the collection, on each item, to examine for matches.
	 * @param {string=} configuration.valuePropertyName - The name of the value to look for in the "inner" array.
	 * @param {string=} configuration.valuesPropertyName - The name of an array of values to look for in the "inner" array.
	 * @param {boolean=} configuration.exact - If true, the "inner" array must match all the items in the "values" array, in order.
	 */
	class FilterContainsResultProcessor extends ResultProcessor {
		constructor(configuration) {
			super(configuration);
		}

		_process(results) {
			const configuration = this._getConfiguration();

			const outerArrayPropertyName = configuration.outerArrayPropertyName;
			const innerArrayPropertyName = configuration.innerArrayPropertyName;

			const valuePropertyName = configuration.valuePropertyName;
			const valuesPropertyName = configuration.valuesPropertyName;

			const itemsToFilter = attributes.read(results, outerArrayPropertyName);

			let returnRef = [ ];

			if (is.array(itemsToFilter) && itemsToFilter.length !== 0) {
				let possibleValues;

				if (is.string(valuePropertyName) && attributes.has(results, valuePropertyName)) {
					possibleValues = [ attributes.read(results, valuePropertyName) ];
				} else if (is.string(valuesPropertyName) && attributes.has(results, valuesPropertyName)) {
					possibleValues = attributes.read(results, valuesPropertyName);
				} else {
					possibleValues = [ ];
				}

				if (is.array(possibleValues) && possibleValues.length !== 0) {
					let predicate;

					if (is.boolean(configuration.exact) && configuration.exact) {
						predicate = (item) => {
							const candidateValues = attributes.read(item, innerArrayPropertyName);

							let returnVal;

							if (is.array(candidateValues) && candidateValues.length === possibleValues.length) {
								returnVal = candidateValues.every((candidateValue, candidateIndex) => {
									return candidateValue === possibleValues[candidateIndex];
								});
							} else {
								returnVal = false;
							}

							return returnVal;
						};
					} else {
						predicate = (item) => {
							const candidateValues = attributes.read(item, innerArrayPropertyName);

							return is.array(candidateValues) && candidateValues.some(candidateValue => possibleValues.some(possibleValue => candidateValue === possibleValue));
						};
					}

					returnRef = itemsToFilter.filter(predicate);
				}
			}

			return returnRef;
		}

		toString() {
			return '[FilterContainsResultProcessor]';
		}
	}

	return FilterContainsResultProcessor;
})();