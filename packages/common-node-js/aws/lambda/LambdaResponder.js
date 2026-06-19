import * as is from '@barchart/common-js/lang/is.js';
import * as assert from '@barchart/common-js/lang/assert.js';

import LambdaResponseProcessor from './responses/LambdaResponseProcessor.js';
import LambdaResponseGenerator from './responses/LambdaResponseGenerator.js';

/**
 * Manages compilation and transmission of the response to from a
 * Lambda Function bound to the API Gateway.
 *
 * @public
 */
export default class LambdaResponder {
	#callback;
	#complete;
	#headers;
	#processor;
	#response;

	/**
	 * @param {Function} callback - The actual "callback" function passed to the Lambda Function by the AWS framework.
	 */
	constructor(callback) {
		assert.argumentIsRequired(callback, 'callback', Function);

		this.#callback = callback;
		this.#processor = new LambdaResponseProcessor();

		this.#headers = LambdaResponseGenerator.getHeadersForJson();

		this.#complete = false;
		this.#response = null;
	}

	/**
	 * If true, the response has already been transmitted.
	 *
	 * @public
	 * @returns {boolean}
	 */
	get complete() {
		return this.#complete;
	}

	/**
	 * Response headers.
	 *
	 * @public
	 * @returns {object}
	 */
	get headers() {
		return this.#headers;
	}

	/**
	 * Sets an HTTP header.
	 *
	 * @public
	 * @param {string} key
	 * @param {string|number|boolean} value
	 * @returns {LambdaResponder}
	 */
	setHeader(key, value) {
		assert.argumentIsRequired(key, 'key', String);

		this.#headers[key] = value;

		return this;
	}

	/**
	 * Sets a response header for plain text.
	 *
	 * @public
	 * @returns {LambdaResponder}
	 */
	setPlainText() {
		return this.setHeader('Content-Type', 'text/plain');
	}

	/**
	 * Adds a {@link LambdaResponseGenerator} instance.
	 *
	 * @public
	 * @param {LambdaResponseGenerator} generator
	 * @returns {LambdaResponder}
	 */
	addResponseGenerator(generator) {
		assert.argumentIsRequired(generator, 'generator', LambdaResponseGenerator, 'LambdaResponseGenerator');

		this.#processor.addResponseGenerator(generator);

		return this;
	}

	/**
	 * Adds multiple {@link LambdaResponseGenerator} instances.
	 *
	 * @public
	 * @param {Array<LambdaResponseGenerator>} generators
	 * @returns {LambdaResponder}
	 */
	addResponseGenerators(generators) {
		generators.forEach(g => this.addResponseGenerator(g));

		return this;
	}

	/**
	 * Immediately transmits an error response.
	 *
	 * @public
	 * @async
	 * @param {object|string} response
	 * @param {number=} responseCode
	 * @returns {Promise<*>}
	 */
	async sendError(response, responseCode) {
		if (this.complete) {
			return this.#response;
		}

		if (is.string(response)) {
			this.setHeader('Content-Type', 'text/plain');
		}

		return this.send(response, responseCode || 500);
	}

	/**
	 * Immediately transmits a successful response.
	 *
	 * @public
	 * @async
	 * @param {object|string} response
	 * @param {number=} responseCode
	 * @returns {Promise<*>}
	 */
	async send(response, responseCode) {
		if (this.complete) {
			return this.#response;
		}

		this.#complete = true;

		let transformed;

		if (!is.nil(response) && !is.undef(response)) {
			let serialized;

			if (Buffer.isBuffer(response)) {
				serialized = response;
			} else if (is.object(response)) {
				serialized = JSON.stringify(response);
			} else {
				this.setHeader('Content-Type', 'text/plain');
				serialized = response.toString();
			}

			transformed = await this.#processor.process(responseCode || 200, this.headers, serialized);
		} else {
			transformed = LambdaResponseGenerator.buildResponseForApiGateway(responseCode || 200, this.headers, response);
		}

		this.#callback(null, this.#response = transformed);

		return transformed;
	}

	/**
	 * Immediately transmits a base-64 encoded response.
	 *
	 * @public
	 * @async
	 * @param {Buffer} buffer
	 * @param {string=} contentType
	 * @returns {Promise<*>}
	 */
	async sendBinary(buffer, contentType) {
		assert.argumentIsOptional(contentType, 'contentType', String);

		if (this.complete) {
			return this.#response;
		}

		this.#complete = true;

		if (contentType) {
			this.setHeader('Content-Type', contentType);
		}

		const response = LambdaResponseGenerator.buildResponseForApiGateway(200, this.headers, buffer.toString('base64'));

		response.isBase64Encoded = true;

		this.#callback(null, this.#response = response);

		return response;
	}

	/**
	 * Immediately transmits an ad hoc response.
	 *
	 * @public
	 * @async
	 * @param {*} response
	 * @param {*=} error
	 * @returns {Promise<*>}
	 */
	async sendRaw(response, error) {
		if (this.complete) {
			return this.#response;
		}

		this.#complete = true;

		this.#callback(error || null, this.#response = response);

		return response;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[LambdaResponder]';
	}
}
