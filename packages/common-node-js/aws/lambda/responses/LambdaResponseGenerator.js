const log4js = require('log4js');

const assert = require('@barchart/common-js/lang/assert');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('common-node/aws/lambda/responses/LambdaResponseGenerator');

	const MAXIMUM_RESPONSE_LENGTH_IN_BYTES = 5 * 1024 * 1024;

	const MINIMUM_RESPONSE_SIZE_FOR_COMPRESSION_IN_BYTES = 1 * 1024;
	const MAXIMUM_RESPONSE_SIZE_FOR_COMPRESSION_IN_BYTES = 50 * 1024 * 1024;

	/**
	 * A strategy for generating the response of a Lambda Function.
	 *
	 * @public
	 * @abstract
	 */
	class LambdaResponseGenerator {
		constructor() {

		}

		/**
		 * Processes the response data and returns a response object (or a null value).
		 *
		 * @public
		 * @async
		 * @param {Number} responseCode
		 * @param {Object} responseHeaders
		 * @param {Buffer|String} responseData
		 * @param {Number} responseSize
		 * @returns {Promise<Object|null>}
		 */
		async generate(responseCode, responseHeaders, responseData, responseSize) {
			return Promise.resolve()
				.then(() => {
					return this._generate(responseCode, responseHeaders, responseData, responseSize);
				});
		}

		/**
		 * @protected
		 * @abstract
		 * @param {Number} responseCode
		 * @param {Object} responseHeaders
		 * @param {Buffer|String} responseData
		 * @param {Number} responseSize
		 * @returns {Promise<Object|null>|Object|null}
		 */
		_generate(responseCode, responseHeaders, responseData, responseSize) {
			return null;
		}

		/**
		 * Returns an object which can be used to respond to an event trigger
		 * from the API Gateway. In other words, returns an object that can
		 * be interpreted by the API Gateway as an HTTP response.
		 *
		 * @public
		 * @param {Number} responseCode
		 * @param {Object} responseHeaders
		 * @param {*} responseData
		 * @param {Boolean=} isBase64Encoded
		 * @returns {Object}
		 */
		static buildResponseForApiGateway(responseCode, responseHeaders, responseData, isBase64Encoded) {
			assert.argumentIsRequired(responseCode, 'responseCode', Number);
			assert.argumentIsRequired(responseHeaders, 'responseHeaders', Object);
			assert.argumentIsOptional(isBase64Encoded, 'isBase64Encoded', Boolean);

			const response = { };

			response.statusCode = responseCode;
			response.headers = responseHeaders;
			response.body = responseData;

			if (isBase64Encoded) {
				response.isBase64Encoded = isBase64Encoded;
			}

			return response;
		}

		/**
		 * Returns an array of headers, suitable for use when responding with JSON data.
		 *
		 * @public
		 * @static
		 * @returns {Array}
		 */
		static getHeadersForJson() {
			const headers = [
				[ 'Access-Control-Allow-Origin', '*' ],
				[ 'Access-Control-Allow-Credentials', true ],
				[ 'Content-Type', 'application/json' ]
			];

			return convertHeadersToObject(headers);
		}

		/**
		 * A simple response strategy.
		 *
		 * @public
		 * @static
		 * @returns {LambdaResponseGenerator}
		 */
		static get DEFAULT() {
			return new LambdaResponseGeneratorDefault();
		}

		/**
		 * The maximum size of a response, in bytes.
		 *
		 * @public
		 * @static
		 * @returns {Number}
		 */
		static get MAXIMUM_RESPONSE_LENGTH_IN_BYTES() {
			return MAXIMUM_RESPONSE_LENGTH_IN_BYTES;
		}

		/**
		 * The minimum size, in bytes, for response compression to be considered.
		 *
		 * @public
		 * @static
		 * @returns {Number}
		 */
		static get MINIMUM_RESPONSE_SIZE_FOR_COMPRESSION_IN_BYTES() {
			return MINIMUM_RESPONSE_SIZE_FOR_COMPRESSION_IN_BYTES;
		}

		/**
		 * The maximum size, in bytes, for response compression to be considered.
		 *
		 * @public
		 * @static
		 * @returns {Number}
		 */
		static get MAXIMUM_RESPONSE_SIZE_FOR_COMPRESSION_IN_BYTES() {
			return MAXIMUM_RESPONSE_SIZE_FOR_COMPRESSION_IN_BYTES;
		}

		toString() {
			return '[LambdaResponseGenerator]';
		}
	}

	function convertHeadersToObject(headersArray) {
		return headersArray.reduce((accumulator, header) => {
			const key = header[0];
			const value = header[1];

			accumulator[key] = value;

			return accumulator;
		}, { });
	}

	class LambdaResponseGeneratorDefault extends LambdaResponseGenerator {
		constructor() {
			super();
		}

		_generate(responseCode, responseHeaders, responseData, responseSize) {
			let body;
			let size;
			let isBase64Encoded;

			if (Buffer.isBuffer(responseData)) {
				body = responseData.toString('base64');
				size = Buffer.byteLength(body, 'base64');
				isBase64Encoded = true;
			} else {
				body = responseData;
				size = responseSize;
				isBase64Encoded = false;
			}

			if (size > LambdaResponseGenerator.MAXIMUM_RESPONSE_LENGTH_IN_BYTES) {
				logger.error(`Unable to process response, response byte size [ ${size} ] exceeds byte limit [ ${LambdaResponseGenerator.MAXIMUM_RESPONSE_LENGTH_IN_BYTES} ]`);

				return LambdaResponseGenerator.buildResponseForApiGateway(413, LambdaResponseGenerator.getHeadersForJson(), JSON.stringify({ message: 'Response too large' }));
			} else {
				return LambdaResponseGenerator.buildResponseForApiGateway(responseCode, responseHeaders, body, isBase64Encoded);
			}
		}

		toString() {
			return '[LambdaResponseGeneratorDefault]';
		}
	}

	return LambdaResponseGenerator;
})();
