import * as assert from '@barchart/common-js/lang/assert.js';

import SecretsManagerProvider from './../SecretsManagerProvider.js';

/**
 * Manages secrets from AWS Secrets Manager.
 *
 * @public
 */
export default class LambdaSecretsManager {
	#cache;

	constructor() {
		this.#cache = new Map();
	}

	/**
	 * A singleton.
	 *
	 * @public
	 * @static
	 * @returns {LambdaSecretsManager}
	 */
	static get INSTANCE() {
		return instance;
	}

	/**
	 * Gets value from AWS Secrets Manager.
	 *
	 * @public
	 * @async
	 * @param {string} secretId
	 * @return {Promise<string>}
	 */
	async getValue(secretId) {
		return Promise.resolve()
			.then(() => {
				assert.argumentIsRequired(secretId, 'secretId', String);

				if (this.#cache.has(secretId)) {
					return Promise.resolve(this.#cache.get(secretId));
				}

				return getSecretsManagerProvider()
					.then((provider) => {
						return provider.getSecretValue(secretId)
							.then((data) => {
								this.#cache.set(secretId, data);

								return data;
							});
					});
			});
	}
}

let secretsManagerProviderPromise = null;

function getSecretsManagerProvider() {
	if (secretsManagerProviderPromise === null) {
		secretsManagerProviderPromise = Promise.resolve()
			.then(() => {
				const configuration = { };

				configuration.region = process.env.SECRETS_MANAGER_REGION || 'us-east-1';

				const provider = new SecretsManagerProvider(configuration);

				return provider.start()
					.then(() => {
						return provider;
					});
			});
	}

	return secretsManagerProviderPromise;
}

const instance = new LambdaSecretsManager();
