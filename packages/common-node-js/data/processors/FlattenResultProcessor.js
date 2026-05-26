const log4js = require('log4js');

const is = require('@barchart/common-js/lang/is'),
	array = require('@barchart/common-js/lang/array');

const ResultProcessor = require('./../ResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/processors/FlattenResultProcessor');

	/**
	 * Flattens an array of arrays.
	 *
	 * @public
	 * @extends ResultProcessor
	 * @param {object} configuration
	 * @param {Boolean} configuration.recursive - If true, flattening will occur beyond the first level.
	 */
	class FlattenResultProcessor extends ResultProcessor {
		constructor(configuration) {
			super(configuration);
		}

		_process(results) {
			if (is.undefined(results) || is.null(results)) {
				return [];
			}

			if (!is.array(results)) {
				throw new Error('Unable to aggregate results, input must be an array.');
			}


			const configuration = this._getConfiguration();
			const recursive = is.boolean(configuration.recursive) && configuration.recursive;

			return array.flatten(results, recursive);
		}

		toString() {
			return '[FlattenResultProcessor]';
		}
	}

	return FlattenResultProcessor;
})();