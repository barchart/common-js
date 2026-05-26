const log4js = require('log4js');

const attributes = require('@barchart/common-js/lang/attributes'),
	is = require('@barchart/common-js/lang/is');

const MutateResultProcessor = require('./MutateResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/processors/ConvertResultProcessor');

	/**
	 * Converts a property's value to another type and overwrites the property.
	 *
	 * @public
	 * @extends MutateResultProcessor
	 * @param {object} configuration
	 * @param {string} configuration.propertyName - Name of property to convert.
	 * @param {string} configuration.propertyType - Desired type. Valid options are: "string"
	 */
	class ConvertResultProcessor extends MutateResultProcessor {
		constructor(configuration) {
			super(configuration);
		}

		_processItem(resultItemToProcess, configurationToUse) {
			const propertyName = configurationToUse.propertyName;

			if (attributes.has(resultItemToProcess, propertyName)) {
				const propertyValue = attributes.read(resultItemToProcess, propertyName);
				const propertyType = configurationToUse.propertyType;

				let convertedValue;

				if (propertyType.toLowerCase() === 'string') {
					if (is.null(propertyValue)) {
						convertedValue = 'null';
					} else if (is.undefined(propertyValue)) {
						convertedValue = 'undefined';
					} else {
						convertedValue = propertyValue.toString();
					}
				} else if (propertyType.toLowerCase() === 'number') {
					if (is.number(propertyValue)) {
						convertedValue = propertyValue;
					} else if (is.string(propertyValue)) {
						convertedValue = parseFloat(propertyValue);
					} else {
						convertedValue = null;
					}
				}

				if (convertedValue !== null) {
					attributes.write(resultItemToProcess, propertyName, convertedValue);
				}
			}
		}

		toString() {
			return '[ConvertResultProcessor]';
		}
	}

	return ConvertResultProcessor;
})();