const log4js = require('log4js');

const assert = require('@barchart/common-js/lang/assert'),
	promise = require('@barchart/common-js/lang/promise');

const ResultProcessor = require('./../ResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/processors/CompositeResultProcessor');

	/**
	 * Uses an array of {@link ResultProcessor} instances for processing. The
	 * instances are invoked sequentially and process synchronously and the
	 * results of one instance are passed to the next.
	 *
	 * @public
	 * @extends ResultProcessor
	 * @param {ResultProcessor[]} resultProcessors
	 */
	class CompositeResultProcessor extends ResultProcessor {
		constructor(resultProcessors) {
			super(null);

			assert.argumentIsArray(resultProcessors, 'resultProcessors', ResultProcessor, 'ResultProcessor');

			this._resultProcessors = resultProcessors;
		}

		_process(results) {
			const functions = this._resultProcessors.map((resultProcessor) => {
				return ResultProcessor.toFunction(resultProcessor);
			});

			return promise.pipeline(functions, results);
		}

		toString() {
			return '[CompositeResultProcessor]';
		}
	}

	return CompositeResultProcessor;
})();