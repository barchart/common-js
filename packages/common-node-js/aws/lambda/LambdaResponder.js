const is = require('@barchart/common-js/lang/is'),
	assert = require('@barchart/common-js/lang/assert');

const LambdaResponseProcessor = require('./responses/LambdaResponseProcessor'),
	LambdaResponseGenerator = require('./responses/LambdaResponseGenerator');

module.exports = (() => {
	'use strict';

	/**
	 * Manages compilation and transmission of the response to from a
	 * Lambda Function bound to the API Gateway.
	 *
	 * @public
	 * @param {Function} callback - The actual "callback" function passed to the Lambda Function by the AWS framework.
	 */
	class LambdaResponder {
		constructor(callback) {
			assert.argumentIsRequired(callback, 'callback', Function);

			this._callback = callback;
			this._processor = new LambdaResponseProcessor();

			this._headers = LambdaResponseGenerator.getHeadersForJson();

			this._complete = false;
			this._response = null;
		}

		/**
		 * If true, the response has already been transmitted.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get complete() {
			return this._complete;
		}

		/**
		 * Response headers.
		 *
		 * @public
		 * @returns {Object}
		 */
		get headers() {
			return this._headers;
		}

		/**
		 * Sets an HTTP header.
		 *
		 * @public
		 * @param {String} key
		 * @param {String|Number|Boolean} value
		 * @returns {LambdaResponder}
		 */
		setHeader(key, value) {
			assert.argumentIsRequired(key, 'key', String);

			this._headers[key] = value;

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

			this._processor.addResponseGenerator(generator);

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
		 * @param {Object|String} response
		 * @param {Number=} responseCode
		 * @returns {Promise<*>}
		 */
		async sendError(response, responseCode) {
			if (this.complete) {
				return this._response;
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
		 * @param {Object|String} response
		 * @param {Number=} responseCode
		 * @returns {Promise<*>}
		 */
		async send(response, responseCode) {
			if (this.complete) {
				return this._response;
			}

			this._complete = true;

			let transformed;

			if (!is.null(response) && !is.undefined(response)) {
				let serialized;

				if (Buffer.isBuffer(response)) {
					serialized = response;
				} else if (is.object(response)) {
					serialized = JSON.stringify(response);
				} else {
					this.setHeader('Content-Type', 'text/plain');
					serialized = response.toString();
				}

				transformed = await this._processor.process(responseCode || 200, this.headers, serialized);
			} else {
				transformed = LambdaResponseGenerator.buildResponseForApiGateway(responseCode || 200, this.headers, response);
			}

			this._callback(null, this._response = transformed);

			return transformed;
		}

		/**
		 * Immediately transmits a base-64 encoded response.
		 *
		 * @public
		 * @async
		 * @param {Buffer} buffer
		 * @param {String=} contentType
		 * @returns {Promise<*>}
		 */
		async sendBinary(buffer, contentType) {
			assert.argumentIsOptional(contentType, 'contentType', String);

			if (this.complete) {
				return this._response;
			}

			this._complete = true;

			if (contentType) {
				this.setHeader('Content-Type', contentType);
			}

			const response = LambdaResponseGenerator.buildResponseForApiGateway(200, this.headers, buffer.toString('base64'));

			response.isBase64Encoded = true;

			this._callback(null, this._response = response);

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
				return this._response;
			}

			this._complete = true;

			this._callback(error || null, this._response = response);

			return response;
		}

		toString() {
			return '[LambdaResponder]';
		}
	}

	return LambdaResponder;
})();
