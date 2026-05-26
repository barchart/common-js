const log4js = require('log4js'),
	numeral = require('numeral');

const attributes = require('@barchart/common-js/lang/attributes'),
	is = require('@barchart/common-js/lang/is');

const MutateResultProcessor = require('./MutateResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/processors/FormatNumberResultProcessor');

	/**
	 * Formats a numeric property using numeral.js format pattern and overwrites
	 * the property.
	 *
	 * @public
	 * @extends MutateResultProcessor
	 * @param {object} configuration
	 * @param {string} configuration.propertyName - The name of the numeric property to format.
	 * @param {string} configuration.format - The numeral.js format string.
	 */
	class FormatNumberResultProcessor extends MutateResultProcessor {
		constructor(configuration) {
			super(configuration);
		}

		_processItem(resultItemToProcess, configurationToUse) {
			let propertyName = configurationToUse.propertyName;
			let propertyValue = attributes.read(resultItemToProcess, propertyName);

			if (is.string(propertyValue)) {
				propertyValue = parseFloat(propertyValue);
			}

			if (is.number(propertyValue)) {
				attributes.write(resultItemToProcess, propertyName, numeral(propertyValue).format(configurationToUse.format));
			}
		}

		toString() {
			return '[FormatNumberResultProcessor]';
		}
	}

	return FormatNumberResultProcessor;
})();