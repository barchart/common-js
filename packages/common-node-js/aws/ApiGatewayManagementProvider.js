import * as assert from '@barchart/common-js/lang/assert.js';

import Disposable from '@barchart/common-js/lang/Disposable.js';

import { ApiGatewayManagementApiClient, PostToConnectionCommand } from '@aws-sdk/client-apigatewaymanagementapi';

import log4js from 'log4js';

const logger = log4js.getLogger('common-node/aws/ApiGatewayManagementProvider');

/**
 * A facade for Amazon's Api Gateway Management. The constructor
 * accepts configuration options. The promise-based instance functions
 * abstract knowledge of the AWS API.
 *
 * @public
 * @extends Disposable
 */
export default class ApiGatewayManagementProvider extends Disposable {
	#agm;
	#configuration;
	#startPromise;
	#started;

	/**
	 * @param {object} configuration - The configuration.
	 * @param {string} configuration.region - The AWS region (e.g. "us-east-1").
	 * @param {string} configuration.endpoint - The endpoint url.
	 * @param {string=} configuration.apiVersion - The Api Gateway Management Api version (defaults to "2018-11-29").
	 */
	constructor(configuration) {
		super();

		assert.argumentIsRequired(configuration, 'configuration', Object);
		assert.argumentIsRequired(configuration.endpoint, 'configuration.endpoint', String);
		assert.argumentIsRequired(configuration.region, 'configuration.region', String);
		assert.argumentIsOptional(configuration.apiVersion, 'configuration.apiVersion', String);

		this.#configuration = configuration;

		this.#agm = null;

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
			throw 'Unable to start, the API Gateway provider has been disposed';
		}

		if (this.#startPromise === null) {
			this.#startPromise = (async () => {
				try {
					this.#agm = new ApiGatewayManagementApiClient({
						apiVersion: this.#configuration.apiVersion || '2018-11-29',
						endpoint: this.#configuration.endpoint,
						region: this.#configuration.region,
					});

					logger.info('The API Gateway provider has started');

					this.#started = true;

					return this.#started;
				} catch (e) {
					logger.error('The API Gateway provider failed to start', e);

					throw e;
				}
			})();
		}

		return this.#startPromise;
	}

	/**
	 * Sends data to provided connection.
	 *
	 * @public
	 * @async
	 * @param {string} connectionId
	 * @param {Buffer|string} data
	 * @returns {Promise}
	 */
	async postToConnection(connectionId, data) {
		assert.argumentIsRequired(connectionId, 'connectionId', String);

		this.#checkReady();

		return this.#agm.send(new PostToConnectionCommand({ ConnectionId: connectionId, Data: Buffer.isBuffer(data) ? data : Buffer.from(data) }));
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[ApiGatewayManagementProvider]';
	}


	#checkReady() {
		if (this.disposed) {
			throw new Error('The API Gateway provider has been disposed.');
			}

			if (!this.#started) {
				throw new Error('The API Gateway provider has not been started.');
			}
		}
}
