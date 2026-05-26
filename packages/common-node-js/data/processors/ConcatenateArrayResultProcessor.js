const log4js = require('log4js');

const attributes = require('@barchart/common-js/lang/attributes'),
	is = require('@barchart/common-js/lang/is');

const MutateResultProcessor = require('./MutateResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/processors/ConcatenateArrayResultProcessor');

	/**
	 * Concatenates an array to another array
	 *
	 * @public
	 * @extends MutateResultProcessor
	 * @param {object} configuration
	 * @param {string} configuration.propertyName - Name of the property to assign concatenated value string to.
	 * @param {string[]} configuration.source - An array interpreted as property references or literal strings.
	 */
	class ConcatenateArrayResultProcessor extends MutateResultProcessor {
		constructor(configuration) {
			super(configuration);
		}

		_processItem(resultItemToProcess, configurationToUse) {
			const propertyName = configurationToUse.propertyName;			
			const properties = attributes.read(resultItemToProcess, propertyName);

			let source;

			if (is.array(configurationToUse.source)) {
				source = configurationToUse.source;
			} else if (is.string(configurationToUse.sourcePropertyName)) {
				source = attributes.read(resultItemToProcess, configurationToUse.sourcePropertyName);
			}

			if (is.array(source) && is.array(properties)) {
				attributes.write(resultItemToProcess, propertyName, properties.concat(source));
			}
		}

		toString() {
			return '[ConcatenateArrayResultProcessor]';
		}
	}

	return ConcatenateArrayResultProcessor;
})();