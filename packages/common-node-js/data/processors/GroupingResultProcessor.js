const log4js = require('log4js');

const array = require('@barchart/common-js/lang/array'),
	attributes = require('@barchart/common-js/lang/attributes'),
	is = require('@barchart/common-js/lang/is');

const MutateResultProcessor = require('./MutateResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/processors/GroupingResultProcessor');

	/**
	 * Breaks an array into named groups according to the value of a single
	 * property from each item in the array.
	 *
	 * @public
	 * @extends MutateResultProcessor
	 * @param {object} configuration
	 * @param {string} configuration.sourcePropertyName - The name of the array to group.
	 * @param {string} configuration.groupPropertyName - The name of the discriminator property each item in the array.
	 * @param {string=} configuration.targetPropertyName - The name of the property to assign the grouped results to (defaults to the sourcePropertyName).
	 */
	class GroupingResultProcessor extends MutateResultProcessor {
		constructor(configuration) {
			super(configuration);
		}

		_processItem(resultItemToProcess, configurationToUse) {
			if (!(is.string(configurationToUse.sourcePropertyName) && is.string(configurationToUse.groupPropertyName))) {
				return;
			}

			const sourcePropertyName = configurationToUse.sourcePropertyName;
			const groupPropertyName = configurationToUse.groupPropertyName;

			let source = attributes.read(resultItemToProcess, sourcePropertyName);

			let groups;

			if (is.array(source)) {
				groups = array.groupBy(source, (sourceItem) => {
					return attributes.read(sourceItem, groupPropertyName);
				});
			} else {
				groups = null;
			}

			let targetPropertyName;

			if (is.string(configurationToUse.targetPropertyName)) {
				targetPropertyName = configurationToUse.targetPropertyName;
			} else {
				targetPropertyName = sourcePropertyName;
			}

			attributes.write(resultItemToProcess, targetPropertyName, groups);
		}

		toString() {
			return '[GroupingResultProcessor]';
		}
	}

	return GroupingResultProcessor;
})();