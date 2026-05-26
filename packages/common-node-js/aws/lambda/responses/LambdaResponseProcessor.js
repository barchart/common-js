const log4js = require('log4js');

const assert = require('@barchart/common-js/lang/assert'),
	promise = require('@barchart/common-js/lang/promise');

const LambdaResponseGenerator = require('./LambdaResponseGenerator');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('common-node/aws/lambda/responses/LambdaResponseProcessor');

	/**
	 * Generates the response for a Lambda Function by iterating through an
	 * ordered list of {@link LambdaResponseGenerator} instances until one
	 * can successfully generate a response.
	 *
	 * @public
	 */
	class LambdaResponseProcessor {
		constructor() {
			this._generators = [ ];
		}

		/**
		 * Adds a custom {@link LambdaResponseGenerator}. Strategies will be
		 * processed in the order they are added. The first successful generator
		 * will be used to generate the response. Subsequent generators will be
		 * ignored.
		 *
		 * @public
		 * @param {LambdaResponseGenerator} generator
		 */
		addResponseGenerator(generator) {
			assert.argumentIsRequired(generator, 'generator', LambdaResponseGenerator, 'LambdaResponseGenerator');

			this._generators.push(generator);
		}

		/**
		 * Runs generators in a sequential order.
		 *
		 * @public
		 * @async
		 * @param {Number} responseCode
		 * @param {Object} responseHeaders
		 * @param {Buffer|String} responseData
		 * @returns {Promise<Object>}
		 */
		async process(responseCode, responseHeaders, responseData) {
			assert.argumentIsRequired(responseCode, 'responseCode', Number);
			assert.argumentIsRequired(responseHeaders, 'responseHeaders', Object);

			const generators = this._generators.slice(0);
			generators.push(LambdaResponseGenerator.DEFAULT);

			const responseSize = Buffer.byteLength(responseData);

			return promise.first(generators.map((generator) => async () => {
				logger.debug('Attempting to process response using [', generator.toString(), ']');

				const response = await generator.generate(responseCode, responseHeaders, responseData, responseSize);

				if (response !== null) {
					logger.debug('Processed response using [', generator.toString(), ']');

					return response;
				} else {
					logger.debug('Unable to process response using [', generator.toString(), ']');

					return null;
				}
			}));
		}

		toString() {
			return '[LambdaResponseProcessor]';
		}
	}

	return LambdaResponseProcessor;
})();
