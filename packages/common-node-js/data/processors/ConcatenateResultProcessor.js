const log4js = require('log4js');

const attributes = require('@barchart/common-js/lang/attributes'),
	is = require('@barchart/common-js/lang/is');

const MutateResultProcessor = require('./MutateResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/processors/ConcatenateResultProcessor');

	/**
	 * Concatenates literal strings (or property references) and assigns
	 * result.
	 *
	 * @public
	 * @extends MutateResultProcessor
	 * @param {object} configuration
	 * @param {string} configuration.propertyName - Name of the property to assign concatenated value string to.
	 * @param {string[]} configuration.source - An array interpreted as property references or literal strings.
	 */
	class ConcatenateResultProcessor extends MutateResultProcessor {
		constructor(configuration) {
			super(configuration);
		}

		_processItem(resultItemToProcess, configurationToUse) {
			let propertyName = configurationToUse.propertyName;

			if (!is.string(propertyName)) {
				return;
			}

			let source;

			if (is.array(configurationToUse.source)) {
				source = configurationToUse.source;
			} else {
				source = [];
			}

			const data = source.map((sourcePropertyName) => {
				let returnRef;

				if (attributes.has(resultItemToProcess, sourcePropertyName)) {
					returnRef = attributes.read(resultItemToProcess, sourcePropertyName).toString();
				} else {
					returnRef = sourcePropertyName;
				}

				return returnRef;
			});

			attributes.write(resultItemToProcess, propertyName, data.join(''));
		}

		toString() {
			return '[ConcatenateResultProcessor]';
		}
	}

	return ConcatenateResultProcessor;
})();