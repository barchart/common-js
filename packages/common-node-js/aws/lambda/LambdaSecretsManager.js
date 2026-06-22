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
		assert.argumentIsRequired(secretId, 'secretId', String);

		if (this.#cache.has(secretId)) {
			return this.#cache.get(secretId);
		}

		const provider = await getSecretsManagerProvider();

		const data = await provider.getSecretValue(secretId);

		this.#cache.set(secretId, data);

		return data;
	}
}

let secretsManagerProviderPromise = null;

function getSecretsManagerProvider() {
	if (secretsManagerProviderPromise === null) {
		secretsManagerProviderPromise = (async () => {
			const configuration = { };

			configuration.region = process.env.SECRETS_MANAGER_REGION || 'us-east-1';

			const provider = new SecretsManagerProvider(configuration);

			await provider.start();

			return provider;
		})();
	}

	return secretsManagerProviderPromise;
}

const instance = new LambdaSecretsManager();
