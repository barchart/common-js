import S3Provider from './../../S3Provider.js';
import LambdaResponseGenerator from './LambdaResponseGenerator.js';

import process from 'process';
import log4js from 'log4js';
import * as uuid from 'uuid';

const logger = log4js.getLogger('common-node/aws/lambda/responses/LambdaResponseGeneratorForS3');

const S3_TTL_FOR_SIGNED_URL_IN_SECONDS = 60;

/**
 * A strategy for very large responses. The actual response is written to S3 and
 * an HTTP 303 (see other) response is sent. This allows the client to load the
 * actual response from S3.
 *
 * @public
 * @extends {LambdaResponseGenerator}
 */
export default class LambdaResponseGeneratorForS3 extends LambdaResponseGenerator {
	constructor() {
		super();
	}

	/**
	 * @protected
	 * @override
	 * @async
	 * @param {number} responseCode
	 * @param {object} responseHeaders
	 * @param {Buffer|string} responseData
	 * @param {number} responseSize
	 * @returns {Promise<object|null>}
	 */
	async _generate(responseCode, responseHeaders, responseData, responseSize) {
		if (responseSize < LambdaResponseGenerator.MAXIMUM_RESPONSE_LENGTH_IN_BYTES) {
			logger.debug('Unable to use S3 response strategy, the response size [', responseSize, '] is too small');

			return null;
		}

		const folder = process.env.AWS_LAMBDA_FUNCTION_NAME || 'generic';
		const key = `${folder}/${uuid.v4()}`;

		logger.debug('Uploading response data to S3, the response size is [', responseSize, ']');

		try {
			const s3 = await getS3Provider();

			logger.debug('S3 provider initialized');

			const mimeType = responseHeaders['Content-Type'] || null;

			await s3.upload(key, responseData, mimeType, true);

			logger.debug('Uploaded response data to S3 at [', key, ']');

			const signedUrl = await s3.getSignedUrl('getObject', key, S3_TTL_FOR_SIGNED_URL_IN_SECONDS);

			logger.debug('Retrieved signed URL for response data at [', key, ']');
			logger.info('Response uploaded to S3, sending HTTP 303 response referring to S3 object at [', key, ']');

			const headers = Object.assign({ }, responseHeaders);
			headers.Location = signedUrl;

			const response = LambdaResponseGenerator.buildResponseForApiGateway(303, headers, null);
			delete response.body;

			return response;
		} catch (error) {
			logger.error('Failed to upload response data to S3', error);

			return null;
		}
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[LambdaResponseGeneratorForS3]';
	}
}

let s3ProviderPromise = null;

function getS3Provider() {
	if (s3ProviderPromise === null) {
		s3ProviderPromise = (async () => {
			const provider = new S3Provider({
				bucket: process.env.S3_LARGE_HTTP_RESPONSE_BUCKET || 'barchart-aws-lambda-responses'
			}, {
				region: process.env.S3_LARGE_HTTP_RESPONSE_REGION || 'us-east-1'
			});

			await provider.start();

			return provider;
		})();
	}

	return s3ProviderPromise;
}
