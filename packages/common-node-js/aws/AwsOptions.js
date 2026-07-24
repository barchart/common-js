import * as assert from '@barchart/common-js/lang/assert.js';

let instance = null;

/**
 * @typedef {object} AwsRequestHandlerOptions
 * @property {number} connectionTimeout - The maximum connection time, in milliseconds.
 * @property {number} socketTimeout - The maximum socket idle time, in milliseconds.
 */

/**
 * @typedef {object} AwsClientConfiguration
 * @property {number} maxAttempts - The maximum number of request attempts.
 * @property {string} region - The AWS region.
 * @property {AwsRequestHandlerOptions} requestHandler - The HTTP request handler options.
 */

/**
 * Provides shared AWS SDK client configuration for service providers.
 *
 * @public
 */
export default class AwsOptions {
	#options;

	/**
	 * @private
	 */
	constructor() {
		this.#options = { };
	}

	/**
	 * Returns the singleton instance.
	 *
	 * @public
	 * @static
	 * @returns {AwsOptions}
	 */
	static get instance() {
		if (instance === null) {
			instance = new AwsOptions();
		}

		return instance;
	}

	/**
	 * Activates the default shared AWS SDK client configuration.
	 *
	 * @public
	 * @static
	 */
	static useDefaultOptions() {
		AwsOptions.setOptions({
			maxAttempts: 3,
			region: 'us-east-1',
			requestHandler: {
				connectionTimeout: 1500,
				socketTimeout: 5000
			}
		});
	}

	/**
	 * Activates shared AWS SDK client configuration.
	 *
	 * @public
	 * @static
	 * @param {object} options - The shared AWS SDK client configuration.
	 */
	static setOptions(options) {
		assert.argumentIsRequired(options, 'options', Object);

		AwsOptions.instance.#options = options;
	}

	/**
	 * Returns the active shared AWS SDK client configuration.
	 *
	 * @public
	 * @returns {object}
	 */
	get options() {
		return this.#options;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[AwsOptions]';
	}
}
