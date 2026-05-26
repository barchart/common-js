const log4js = require('log4js');

const attributes = require('@barchart/common-js/lang/attributes'),
	is = require('@barchart/common-js/lang/is');

const ResultProcessor = require('./../ResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/processors/MutateResultProcessor');

	/**
	 * A result processor that is guaranteed to return the same
	 * object as it's passed. However, during processing, the
	 * object will likely be mutated.
	 *
	 * @public
	 * @interface
	 * @extends ResultProcessor
	 * @param {Object} configuration - Used by inheriting class.
	 */
	class MutateResultProcessor extends ResultProcessor {
		constructor(configuration) {
			super(configuration);

			let configurationArray;

			if (is.array(configuration.items)) {
				configurationArray = configuration.items;
			} else {
				configurationArray = [configuration];
			}

			this._configurationArray = configurationArray;
		}

		_process(results) {
			if (is.undefined(results) || is.null(results)) {
				logger.warn('Skipping result processor (' + this.toString() + ') due to undefined or null results.');

				return results;
			}

			let resultsToProcess;

			if (is.array(results)) {
				resultsToProcess = results;
			} else {
				resultsToProcess = [results];
			}

			const processedResults = resultsToProcess.map((result) => {
				this._configurationArray.forEach((configurationItem) => {
					this._processItem(result, configurationItem);
				});

				return result;
			});

			let returnRef;

			if (is.array(results)) {
				returnRef = processedResults;
			} else {
				returnRef = processedResults[0];
			}

			return returnRef;
		}

		_processItem(resultItemToProcess, configurationToUse) {
			return;
		}

		toString() {
			return '[MutateResultProcessor]';
		}
	}

	return MutateResultProcessor;
})();