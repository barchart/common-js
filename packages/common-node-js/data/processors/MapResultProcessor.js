const log4js = require('log4js');

const attributes = require('@barchart/common-js/lang/attributes'),
	is = require('@barchart/common-js/lang/is');

const MutateResultProcessor = require('./MutateResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/processors/MapResultProcessor');

	/**
	 * Reads an array and creates a new array, mapping each item to an
	 * alternate value (if possible) and overwrites the array.
	 *
	 * @public
	 * @extends MutateResultProcessor
	 * @param {object} configuration
	 * @param {string} configuration.mapPropertyName - The map of replacement values.
	 * @param {string} configuration.targetPropertyName - The array of values to replace.
	 */
	class MapResultProcessor extends MutateResultProcessor {
		constructor(configuration) {
			super(configuration);
		}

		_processItem(resultItemToProcess, configurationToUse) {
			const map = attributes.read(resultItemToProcess, configurationToUse.mapPropertyName);
			const values = attributes.read(resultItemToProcess, configurationToUse.targetPropertyName);

			const separator = configurationToUse.customSeparator;

			if (is.object(map) && is.array(values)) {
				attributes.write(resultItemToProcess, configurationToUse.targetPropertyName, values.map((value) => {
					let mapped;

					if (attributes.has(map, value, separator)) {
						mapped = attributes.read(map, value, separator);
					} else {
						mapped = value;
					}

					return mapped;
				}), separator);
			}
		}

		toString() {
			return '[MapResultProcessor]';
		}
	}

	return MapResultProcessor;
})();