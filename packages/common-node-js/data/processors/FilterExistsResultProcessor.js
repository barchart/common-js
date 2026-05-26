const log4js = require('log4js');

const attributes = require('@barchart/common-js/lang/attributes'),
	is = require('@barchart/common-js/lang/is');

const ResultProcessor = require('./../ResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/processors/FilterExistsResultProcessor');

	/**
	 * Filters an array to items where a specific property exists (or
	 * does not exist).
	 *
	 * @public
	 * @extends ResultProcessor
	 * @extends ResultProcessor
	 * @param {Object} configuration
	 * @param {string=} configuration.sourceRef - The name of the array to filter. If not supplied, the context is used as the array to filter.
	 * @param {Object[]} configuration.conditions
	 * @param {string} configuration.conditions[].propertyName - The name of property (which must exist).
	 * @param {boolen=} configuration.conditions[].inverse - If true, items which are exist are filtered.
	 */
	class FilterExistsResultProcessor extends ResultProcessor {
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
						const exists = attributes.has(result, condition.propertyName);
						const inverse = is.boolean(condition.inverse) && condition.inverse;

						return exists ^ inverse;
					});
				});
			} else {
				returnRef = [ ];
			}

			return returnRef;
		}

		toString() {
			return '[FilterExistsResultProcessor]';
		}
	}

	return FilterExistsResultProcessor;
})();