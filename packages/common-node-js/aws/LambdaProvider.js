import * as assert from '@barchart/common-js/lang/assert.js';
import * as is from '@barchart/common-js/lang/is.js';

import Disposable from '@barchart/common-js/lang/Disposable.js';

import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';

import log4js from 'log4js';

const logger = log4js.getLogger('common-node/aws/LambdaProvider');

/**
 * @typedef {object} LambdaProviderOptions
 * @property {import('@aws-sdk/client-lambda').LambdaClientConfig=} clientConfiguration - Configuration passed to the AWS SDK client.
 */

/**
 * Wrapper for Amazon's Lambda SDK.
 *
 * @public
 * @extends Disposable
 */
export default class LambdaProvider extends Disposable {
	#configuration;
	#lambda;
	#options;
	#startPromise;
	#started;

	/**
	 * @param {object} configuration - The configuration.
	 * @param {string} configuration.region
	 * @param {string=} configuration.apiVersion
	 * @param {string=} configuration.bucket
	 * @param {string=} configuration.folder
	 * @param {LambdaProviderOptions=} options - The options.
	 */
	constructor(configuration, options) {
		super();

		assert.argumentIsRequired(configuration, 'configuration');
		assert.argumentIsRequired(configuration.region, 'configuration.region', String);
		assert.argumentIsOptional(configuration.apiVersion, 'configuration.apiVersion', String);
		assert.argumentIsOptional(options, 'options', Object);

		if (options) {
			assert.argumentIsOptional(options.clientConfiguration, 'options.clientConfiguration', Object);
		}

		this.#configuration = configuration;
		this.#options = Object.assign({ clientConfiguration: { } }, options || { });

		this.#lambda = null;

		this.#startPromise = null;
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

		if (this.#startPromise === null) {
			this.#startPromise = (async () => {
				try {
					this.#lambda = new LambdaClient({
						...this.#options.clientConfiguration,
						apiVersion: this.#configuration.apiVersion || '2015-03-31',
						region: this.#configuration.region
					});

					logger.info('The Lambda provider has started');

					this.#started = true;

					return this.#started;
				} catch (e) {
					logger.error('The Lambda provider failed to start', e);

					throw e;
				}
			})();
		}

		return this.#startPromise;
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
