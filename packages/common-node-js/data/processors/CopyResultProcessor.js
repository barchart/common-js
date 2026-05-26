const log4js = require('log4js');

const attributes = require('@barchart/common-js/lang/attributes'),
	is = require('@barchart/common-js/lang/is');

const MutateResultProcessor = require('./MutateResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/processors/CopyResultProcessor');

	/**
	 * Copies a property's value to one (or more) other properties, optionally selecting a
	 * portion of the property's value with a regular expression.
	 *
	 * @public
	 * @extends MutateResultProcessor
	 * @param {object} configuration
	 * @param {string} configuration.sourcePropertyName - The property to copy.
	 * @param {string} configuration.regex - Optional. A regular expression to apply to the source property value.
	 * @param {string} configuration.targetPropertyName - Optional. The name of the property to assign.
	 * @param {string[]} configuration.targetPropertyNames - Optional. The names of the properties to assign.
	 */
	class CopyResultProcessor extends MutateResultProcessor {
		constructor(configuration) {
			super(configuration);
		}

		_processItem(resultItemToProcess, configurationToUse) {
			let targetPropertyNames;

			if (is.string(configurationToUse.targetPropertyName)) {
				targetPropertyNames = [configurationToUse.targetPropertyName];
			} else if (is.array(configurationToUse.targetPropertyNames)) {
				targetPropertyNames = configurationToUse.targetPropertyNames;
			} else {
				targetPropertyNames = [];
			}

			let sourcePropertyValue = attributes.read(resultItemToProcess, configurationToUse.sourcePropertyName);

			if (is.string(sourcePropertyValue) && configurationToUse.regex) {
				let matches = sourcePropertyValue.match(new RegExp(configurationToUse.regex));
				let matchedValue;

				if (is.array(matches) && matches.length !== 0) {
					matchedValue = matches[0];
				} else {
					matchedValue = '';
				}

				sourcePropertyValue = matchedValue;
			}

			targetPropertyNames.forEach((targetPropertyName) => {
				attributes.write(resultItemToProcess, targetPropertyName, sourcePropertyValue);
			});
		}

		toString() {
			return '[CopyResultProcessor]';
		}
	}

	return CopyResultProcessor;
})();