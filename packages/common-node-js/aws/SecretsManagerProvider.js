const aws = require('aws-sdk'),
	log4js = require('log4js');

const assert = require('@barchart/common-js/lang/assert'),
	Disposable = require('@barchart/common-js/lang/Disposable');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('common-node/aws/SecretsManagerProvider');

	/**
	 * A facade for Amazon's Secrets Manager. The constructor accepts configuration
	 * options. The promise-based instance functions abstract knowledge of the AWS API.
	 *
	 * @public
	 * @extends {Disposable}
	 * @param {object} configuration
	 * @param {string} configuration.region - The AWS region (e.g. "us-east-1").
	 * @param {string=} configuration.apiVersion - The Secrets Manager version (defaults to "2017-10-17").
	 */
	class SecretsManagerProvider extends Disposable {
		constructor(configuration) {
			super(configuration);

			assert.argumentIsRequired(configuration, 'configuration', Object);
			assert.argumentIsRequired(configuration.region, 'configuration.region', String);
			assert.argumentIsOptional(configuration.apiVersion, 'configuration.apiVersion', String);

			this._configuration = configuration;

			this._secretsManager = null;

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
				return Promise.reject('Unable to start, the Secrets Manager provider has been disposed');
			}

			if (this._startPromise === null) {
				this._startPromise = Promise.resolve()
					.then(() => {
						aws.config.update({ region: this._configuration.region });

						this._secretsManager = new aws.SecretsManager({ apiVersion: this._configuration.apiVersion || '2017-10-17' });
					}).then(() => {
						logger.info('The Secrets Manager provider has started');

						this._started = true;

						return this._started;
					}).catch((e) => {
						logger.error('The Secrets Manager provider failed to start', e);

						throw e;
					});
			}

			return this._startPromise;
		}

		/**
		 * Gets a secret's value.
		 *
		 * @public
		 * @async
		 * @param {String} secretId
		 * @returns {Promise<String>}
		 */
		async getSecretValue(secretId) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(secretId, 'secretId', String);

					if (secretId.length === 0) {
						throw new Error('The "secretId" argument cannot be a zero-length string');
					}

					checkReady.call(this);

					logger.debug(`Attempting to retrieve secret [ ${secretId} ]`);

					return Promise.resolve(this._secretsManager.getSecretValue({ SecretId: secretId }).promise())
						.then((response) => {
							logger.info(`Retrieved secret [ ${secretId} ]`);

							return response.SecretString;
						}).catch((err) => {
							logger.error(`Failed to retrieve secret [ ${secretId} ]`);

							return Promise.reject(err);
						});
				});
		}

		toString() {
			return '[SecretsManagerProvider]';
		}
	}

	function checkReady() {
		if (this.disposed) {
			throw new Error('The Secrets Manager provider has been disposed');
		}

		if (!this._started) {
			throw new Error('The Secrets Manager provider has not been started');
		}
	}

	return SecretsManagerProvider;
})();
