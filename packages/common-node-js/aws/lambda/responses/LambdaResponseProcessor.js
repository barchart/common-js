import * as assert from '@barchart/common-js/lang/assert.js';
import * as promise from '@barchart/common-js/lang/promise.js';

import LambdaResponseGenerator from './LambdaResponseGenerator.js';

import log4js from 'log4js';

const logger = log4js.getLogger('common-node/aws/lambda/responses/LambdaResponseProcessor');

/**
 * Generates the response for a Lambda Function by iterating through an
 * ordered list of {@link LambdaResponseGenerator} instances until one
 * can successfully generate a response.
 *
 * @public
 */
export default class LambdaResponseProcessor {
	#generators;

	constructor() {
		this.#generators = [ ];
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

		this.#generators.push(generator);
	}

	/**
	 * Runs generators in a sequential order.
	 *
	 * @public
	 * @async
	 * @param {number} responseCode
	 * @param {object} responseHeaders
	 * @param {Buffer|string} responseData
	 * @returns {Promise<object>}
	 */
	async process(responseCode, responseHeaders, responseData) {
		assert.argumentIsRequired(responseCode, 'responseCode', Number);
		assert.argumentIsRequired(responseHeaders, 'responseHeaders', Object);

		const generators = this.#generators.slice(0);
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

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[LambdaResponseProcessor]';
	}
}
