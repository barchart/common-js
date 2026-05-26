const log4js = require('log4js');

const attributes = require('@barchart/common-js/lang/attributes'),
	is = require('@barchart/common-js/lang/is');

const MutateResultProcessor = require('./MutateResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/processors/PushResultProcessor');

	/**
	 * Reads a property and adds it to an array, creating the array if necessary.
	 *
	 * @public
	 * @extends MutateResultProcessor
	 * @param {object} configuration
	 * @param {string} configuration.arrayPropertyName - The property name of the array which the item will be pushed into.
	 * @param {string} configuration.itemPropertyName - The property name of the item to add to the array.
	 */
	class PushResultProcessor extends MutateResultProcessor {
		constructor(configuration) {
			super(configuration);
		}

		_processItem(resultItemToProcess, configurationToUse) {
			const arrayPropertyName = configurationToUse.arrayPropertyName;
			const itemPropertyName = configurationToUse.itemPropertyName;

			if (!(is.string(arrayPropertyName) && is.string(itemPropertyName) && attributes.has(resultItemToProcess, itemPropertyName))) {
				return;
			}

			if (!attributes.has(resultItemToProcess, arrayPropertyName)) {
				attributes.write(resultItemToProcess, arrayPropertyName, [ ]);
			}

			const array = attributes.read(resultItemToProcess, arrayPropertyName);
			const item = attributes.read(resultItemToProcess, itemPropertyName);

			array.push(item);
		}

		toString() {
			return '[PushResultProcessor]';
		}
	}

	return PushResultProcessor;
})();