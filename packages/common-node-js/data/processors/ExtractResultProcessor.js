const log4js = require('log4js');

const attributes = require('@barchart/common-js/lang/attributes'),
	is = require('@barchart/common-js/lang/is');

const ResultProcessor = require('./../ResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/processors/ExtractResultProcessor');

	/**
	 * Maps the results into a new array, selecting a single property from each item.
	 *
	 * @public
	 * @extends ResultProcessor
	 * @param {object} configuration
	 * @param {string} configuration.propertyName - The name of the property to select from each item.
	 */
	class ExtractResultProcessor extends ResultProcessor {
		constructor(configuration) {
			super(configuration);
		}

		_process(results) {
			if (is.undefined(results) || is.null(results)) {
				return [];
			}

			if (!is.array(results)) {
				throw new Error('Unable to extract results, input must be an array.');
			}

			const configuration = this._getConfiguration();
			const propertyName = configuration.propertyName;

			if (!is.string(propertyName) || propertyName.length === 0) {
				return results;
			}

			return results.map((item) => {
				return attributes.read(item, propertyName);
			});
		}

		toString() {
			return '[ExtractResultProcessor]';
		}
	}

	return ExtractResultProcessor;
})();