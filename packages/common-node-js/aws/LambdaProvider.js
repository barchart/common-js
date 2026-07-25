import * as assert from '@barchart/common-js/lang/assert.js';
import * as is from '@barchart/common-js/lang/is.js';

import Disposable from '@barchart/common-js/lang/Disposable.js';

import AwsOptions from './AwsOptions.js';

import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';

import log4js from 'log4js';

const logger = log4js.getLogger('common-node/aws/LambdaProvider');

/**
 * AWS SDK client configuration for the Lambda provider.
 *
 * @typedef {import('@aws-sdk/client-lambda').LambdaClientConfig} LambdaProviderOptions
 */

/**
 * Wrapper for Amazon's Lambda SDK.
 *
 * @public
 * @extends Disposable
 */
export default class LambdaProvider extends Disposable {
	#lambda;

	#options;

	#started;

	/**
	 * @param {LambdaProviderOptions=} options - The AWS SDK client configuration.
	 */
	constructor(options) {
		super();

		assert.argumentIsOptional(options, 'options', Object);

		this.#lambda = null;

		this.#options = { ...AwsOptions.instance.options, ...options };

		this.#started = false;
	}

	/**
	 * Connects to Amazon. Must be called once before using other instance
	 * functions.
	 *
	 * @public
	 * @async
	 * @returns {Promise<boolean>}
	 */
	async start() {
		if (this.disposed) {
			throw 'Unable to start, the Lambda provider has been disposed.';
		}

		if (!this.#started) {
			try {
				this.#lambda = new LambdaClient(this.#options);

				logger.info('The Lambda provider has started');

				this.#started = true;
			} catch (e) {
				logger.error('The Lambda provider failed to start', e);

				throw e;
			}
		}

		return this.#started;
	}

	/**
	 * Triggers a lambda function, asynchronously or synchronously.
	 *
	 * @public
	 * @async
	 * @param {string} functionName
	 * @param {object} event
	 * @param {boolean=} synchronous
	 * @returns {Promise<object>}
	 */
	async invoke(functionName, event, synchronous) {
		assert.argumentIsRequired(functionName, 'functionName', String);
		assert.argumentIsRequired(event, 'event');
		assert.argumentIsOptional(synchronous, 'synchronous', Boolean);

		this.#checkReady();

		const data = { };

		data.FunctionName = functionName;
		data.Payload = Buffer.from(JSON.stringify(event));

		if (!(is.boolean(synchronous) && synchronous)) {
			data.InvocationType = 'Event';
		}

		return this.#lambda.send(new InvokeCommand(data));
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[LambdaProvider]';
	}

	#checkReady() {
		if (this.disposed) {
			throw new Error('The Lambda provider has been disposed.');
		}

		if (!this.#started) {
			throw new Error('The Lambda provider has not been started.');
		}
	}
}
