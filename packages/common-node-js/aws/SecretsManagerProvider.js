import * as assert from '@barchart/common-js/lang/assert.js';

import Disposable from '@barchart/common-js/lang/Disposable.js';

import AwsOptions from './AwsOptions.js';

import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';

import log4js from 'log4js';

const logger = log4js.getLogger('common-node/aws/SecretsManagerProvider');

/**
 * AWS SDK client configuration for the Secrets Manager provider.
 *
 * @typedef {import('@aws-sdk/client-secrets-manager').SecretsManagerClientConfig} SecretsManagerProviderOptions
 */

/**
 * A facade for Amazon's Secrets Manager. The constructor accepts configuration
 * options. The promise-based instance functions abstract knowledge of the AWS API.
 *
 * @public
 * @extends {Disposable}
 */
export default class SecretsManagerProvider extends Disposable {
	#options;
	#secretsManager;
	#startPromise;
	#started;

	/**
	 * @param {SecretsManagerProviderOptions=} options - The AWS SDK client configuration.
	 */
	constructor(options) {
		super();

		assert.argumentIsOptional(options, 'options', Object);

		this.#options = {
			...AwsOptions.instance.options,
			...options
		};

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
					this.#secretsManager = new SecretsManagerClient(this.#options);

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
