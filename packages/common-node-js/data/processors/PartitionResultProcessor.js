const log4js = require('log4js');

const array = require('@barchart/common-js/lang/array'),
	attributes = require('@barchart/common-js/lang/attributes'),
	is = require('@barchart/common-js/lang/is');

const ResultProcessor = require('./../ResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/processors/PartitionResultProcessor');

	class PartitionResultProcessor extends ResultProcessor {
		constructor(configuration) {
			super(configuration);
		}

		_process(results) {
			if (is.undefined(results) || is.null(results)) {
				return [];
			}

			if (!is.array(results)) {
				throw new Error('Unable to partition results, input must be an array.');
			}

			const configuration = this._getConfiguration();

			let partitionSize = configuration.size;

			if (is.string(partitionSize)) {
				partitionSize = parseInt(partitionSize);
			}

			return array.partition(results, partitionSize || 10);
		}

		toString() {
			return '[PartitionResultProcessor]';
		}
	}

	return PartitionResultProcessor;
})();