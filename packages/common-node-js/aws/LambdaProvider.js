import * as assert from '@barchart/common-js/lang/assert.js';
import * as is from '@barchart/common-js/lang/is.js';

import Disposable from '@barchart/common-js/lang/Disposable.js';

import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';

import log4js from 'log4js';

const logger = log4js.getLogger('common-node/aws/LambdaProvider');

/**
 * Wrapper for Amazon's Lambda SDK.
 *
 * @public
 * @extends Disposable
 * @param {object} configuration
 * @param {string} configuration.region
 * @param {string=} configuration.apiVersion
 * @param {string=} configuration.bucket
 * @param {string=} configuration.folder
 */
export default class LambdaProvider extends Disposable {
	constructor(configuration) {
		super();

		assert.argumentIsRequired(configuration, 'configuration');
		assert.argumentIsRequired(configuration.region, 'configuration.region', String);
		assert.argumentIsOptional(configuration.apiVersion, 'configuration.apiVersion', String);

		this._configuration = configuration;

		this._lambda = null;

		this._startPromise = null;
		this._started = false;
	}

	/**
	 * Connects to Amazon. Must be called once before using other instance
	 * functions.
	 *
	 * @public
	 * @async
	 * @returns {Promise<Boolean>}
	 */
	async start() {
		if (this.disposed) {
			return Promise.reject('Unable to start, the Lambda provider has been disposed.');
		}

		if (this._startPromise === null) {
			this._startPromise = (async () => {
				try {
					this._lambda = new LambdaClient({ apiVersion: this._configuration.apiVersion || '2015-03-31', region: this._configuration.region });

					logger.info('The Lambda provider has started');

					this._started = true;

					return this._started;
				} catch (e) {
					logger.error('The Lambda provider failed to start', e);

					throw e;
				}
			})();
		}

		return this._startPromise;
	}

	/**
	 * Triggers a lambda function, asynchronously or synchronously.
	 *
	 * @public
	 * @async
	 * @param {String} functionName
	 * @param {Object} event
	 * @param {Boolean=} synchronous
	 * @return {Promise<Object>}
	 */
	async invoke(functionName, event, synchronous) {
		assert.argumentIsRequired(functionName, 'functionName', String);
		assert.argumentIsRequired(event, 'event');
		assert.argumentIsOptional(synchronous, 'synchronous', Boolean);

		checkReady.call(this);

		const data = { };

		data.FunctionName = functionName;
		data.Payload = Buffer.from(JSON.stringify(event));

		if (!(is.boolean(synchronous) && synchronous)) {
			data.InvocationType = 'Event';
		}

		return this._lambda.send(new InvokeCommand(data));
	}

	toString() {
		return '[LambdaProvider]';
	}
}

function checkReady() {
	if (this.disposed) {
		throw new Error('The Lambda provider has been disposed.');
	}

	if (!this._started) {
		throw new Error('The Lambda provider has not been started.');
	}
}
