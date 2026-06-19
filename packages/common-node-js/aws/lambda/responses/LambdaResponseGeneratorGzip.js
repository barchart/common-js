import * as assert from '@barchart/common-js/lang/assert.js';
import * as is from '@barchart/common-js/lang/is.js';
import * as promise from '@barchart/common-js/lang/promise.js';

import LambdaEventParser from './../LambdaEventParser.js';
import LambdaResponseGenerator from './LambdaResponseGenerator.js';

import log4js from 'log4js';
import zlib from 'zlib';

const logger = log4js.getLogger('common-node/aws/lambda/responses/LambdaResponseGeneratorGzip');

/**
 * A strategy for compressing the response with the GZIP algorithm.
 *
 * @public
 * @extends {LambdaResponseGenerator}
 */
export default class LambdaResponseGeneratorGzip extends LambdaResponseGenerator {
	#parser;

	/**
	 * @param {*} parser
	 */
	constructor(parser) {
		super();

		assert.argumentIsRequired(parser, 'parser', LambdaEventParser, 'LambdaEventParser');

		this.#parser = parser;
	}

	_generate(responseCode, responseHeaders, responseData, responseSize) {
		const acceptEncoding = this.#parser.getHeader('Accept-Encoding') || this.#parser.getHeader('accept-encoding');

		if (!(is.string(acceptEncoding) && acceptEncoding.includes('gzip'))) {
			logger.debug('Unable to compress response, the request header [ Accept-Encoding ] does not include the [ gzip ] option');

			return null;
		}

		if (responseSize < LambdaResponseGenerator.MINIMUM_RESPONSE_SIZE_FOR_COMPRESSION_IN_BYTES) {
			logger.debug('Unable to compress response, the response size [', responseSize, '] is too small for compression to be useful');

			return null;
		}

		if (responseSize > LambdaResponseGenerator.MAXIMUM_RESPONSE_SIZE_FOR_COMPRESSION_IN_BYTES) {
			logger.debug('Unable to compress response, the uncompressed response size [', responseSize, '] is too large for compression to be useful');

			return null;
		}

		logger.debug('Response compression started, uncompressed size is [', responseSize, ']');

		return compress(responseData).then((compressedData) => {
			const compressedSize = Buffer.byteLength(compressedData, 'base64');

			if (compressedSize > LambdaResponseGenerator.MAXIMUM_RESPONSE_LENGTH_IN_BYTES) {
				logger.debug('Response compressed completed; however, the compressed response size [', compressedSize, '] exceeds the maximum response size [', LambdaResponseGenerator.MAXIMUM_RESPONSE_LENGTH_IN_BYTES, ']');

				return null;
			} else {
				logger.debug('Response compressed completed; compressed response size is [', compressedSize, ']');

				const headers = Object.assign({ }, responseHeaders);
				headers['Content-Encoding'] = 'gzip';

				return LambdaResponseGenerator.buildResponseForApiGateway(responseCode, headers, compressedData.toString('base64'), true);
			}
		});
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[LambdaResponseGeneratorGzip]';
	}
}

function compress(dataToCompress) {
	return promise.build((resolve, reject) => {
		zlib.gzip(dataToCompress, (error, compressedData) => {
			if (error) {
				logger.error(error);

				reject(error);
			} else {
				resolve(compressedData);
			}
		});
	});
}
