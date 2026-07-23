import * as assert from '@barchart/common-js/lang/assert.js';

import Disposable from '@barchart/common-js/lang/Disposable.js';

import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';

import log4js from 'log4js';

const logger = log4js.getLogger('common-node/aws/SecretsManagerProvider');

/**
 * @typedef {object} SecretsManagerProviderOptions
 * @property {import('@aws-sdk/client-secrets-manager').SecretsManagerClientConfig=} clientConfiguration - Configuration passed to the AWS SDK client.
 */

/**
 * A facade for Amazon's Secrets Manager. The constructor accepts configuration
 * options. The promise-based instance functions abstract knowledge of the AWS API.
 *
 * @public
 * @extends {Disposable}
 */
export default class SecretsManagerProvider extends Disposable {
	#configuration;
	#options;
	#secretsManager;
	#startPromise;
	#started;

	/**
	 * @param {object} configuration - The configuration.
	 * @param {string} configuration.region - The AWS region (e.g. "us-east-1").
	 * @param {string=} configuration.apiVersion - The Secrets Manager version (defaults to "2017-10-17").
	 * @param {SecretsManagerProviderOptions=} options - The options.
	 */
	constructor(configuration, options) {
		super();

		assert.argumentIsRequired(configuration, 'configuration', Object);
		assert.argumentIsRequired(configuration.region, 'configuration.region', String);
		assert.argumentIsOptional(configuration.apiVersion, 'configuration.apiVersion', String);
		assert.argumentIsOptional(options, 'options', Object);

		if (options) {
			assert.argumentIsOptional(options.clientConfiguration, 'options.clientConfiguration', Object);
		}

		this.#configuration = configuration;
		this.#options = Object.assign({ clientConfiguration: { } }, options || { });

		this.#secretsManager = null;

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
			throw 'Unable to start, the Secrets Manager provider has been disposed';
		}

		if (this.#startPromise === null) {
			this.#startPromise = (async () => {
				try {
					this.#secretsManager = new SecretsManagerClient({
						...this.#options.clientConfiguration,
						apiVersion: this.#configuration.apiVersion || '2017-10-17',
						region: this.#configuration.region
					});

					logger.info('The Secrets Manager provider has started');

					this.#started = true;

					return this.#started;
				} catch (e) {
					logger.error('The Secrets Manager provider failed to start', e);

					throw e;
				}
			})();
		}

		return this.#startPromise;
	}

	/**
	 * Gets a secret's value.
	 *
	 * @public
	 * @async
	 * @param {string} secretId
	 * @returns {Promise<string>}
	 */
	async getSecretValue(secretId) {
		assert.argumentIsRequired(secretId, 'secretId', String);

		if (secretId.length === 0) {
			throw new Error('The "secretId" argument cannot be a zero-length string');
		}

		this.#checkReady();

		logger.debug(`Attempting to retrieve secret [ ${secretId} ]`);

		try {
			const response = await this.#secretsManager.send(new GetSecretValueCommand({ SecretId: secretId }));

			logger.info(`Retrieved secret [ ${secretId} ]`);

			return response.SecretString;
		} catch (err) {
			logger.error(`Failed to retrieve secret [ ${secretId} ]`);

			throw err;
		}
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[SecretsManagerProvider]';
	}


	#checkReady() {
		if (this.disposed) {
			throw new Error('The Secrets Manager provider has been disposed');
			}

			if (!this.#started) {
				throw new Error('The Secrets Manager provider has not been started');
			}
		}
}
