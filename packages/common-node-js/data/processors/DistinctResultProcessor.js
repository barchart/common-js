const log4js = require('log4js');

const array = require('@barchart/common-js/lang/array'),
	attributes = require('@barchart/common-js/lang/attributes'),
	is = require('@barchart/common-js/lang/is');

const ResultProcessor = require('./../ResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/processors/DistinctResultProcessor');

	/**
	 * Accepts an array of items and returns a new array composed of distinct property
	 * values read from item's in the original array.
	 *
	 * @public
	 * @extends ResultProcessor
	 * @param {object} configuration
	 * @param {string} configuration.property - The name of the property to find distinct values for.
	 * @param {boolean=} configuration.wrap - If explicitly false, the distinct values will not be wrapped in objects, using the "property" name.
	 */
	class DistinctResultProcessor extends ResultProcessor {
		constructor(configuration) {
			super(configuration);
		}

		_process(results) {
			const configuration = this._getConfiguration();

			let returnRef;

			if (is.string(configuration.property)) {
				const propertyName = configuration.property;

				let wrap;

				if (is.boolean(configuration.wrap)) {
					wrap = configuration.wrap;
				} else {
					wrap = true;
				}

				const items =
					array.unique(
						results.reduce((accumulator, result) => {
							const value = attributes.read(result, propertyName);

							if (is.array(value)) {
								value.forEach((item) => {
									accumulator.push(item);
								});
							} else {
								accumulator.push(value);
							}

							return accumulator;
						}, [ ])
					);

				if (wrap) {
					returnRef = items.map((item) => {
						const wrapper = {};

						wrapper[propertyName] = item;

						return wrapper;
					});
				} else {
					returnRef = items;
				}
			} else {
				returnRef = results;
			}

			return returnRef;
		}

		toString() {
			return '[DistinctResultProcessor]';
		}
	}

	return DistinctResultProcessor;
})();