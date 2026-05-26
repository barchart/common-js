const process = require('process');

const log4js = require('log4js'),
	uuid = require('uuid');

const S3Provider = require('./../../S3Provider');

const LambdaResponseGenerator = require('./LambdaResponseGenerator');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('common-node/aws/lambda/responses/LambdaResponseGeneratorForS3');

	const S3_TTL_FOR_SIGNED_URL_IN_SECONDS = 60;

	/**
	 * A strategy for very large responses. The actual response is written to S3 and
	 * an HTTP 303 (see other) response is sent. This allows the client to load the
	 * actual response from S3.
	 *
	 * @public
	 * @extends {LambdaResponseGenerator}
	 * @param {Object} options
	 */
	class LambdaResponseGeneratorForS3 extends LambdaResponseGenerator {
		constructor() {
			super();
		}

		_generate(responseCode, responseHeaders, responseData, responseSize) {
			if (responseSize < LambdaResponseGenerator.MAXIMUM_RESPONSE_LENGTH_IN_BYTES) {
				logger.debug('Unable to use S3 response strategy, the response size [', responseSize, '] is too small');

				return null;
			}

			const folder = process.env.AWS_LAMBDA_FUNCTION_NAME || 'generic';
			const key = `${folder}/${uuid.v4()}`;

			logger.debug('Uploading response data to S3, the response size is [', responseSize, ']');

			return Promise.resolve({ })
				.then((context) => {
					return getS3Provider()
						.then((s3) => {
							logger.debug('S3 provider initialized');

							context.s3 = s3;

							return context;
						});
				}).then((context) => {
					const mimeType = responseHeaders['Content-Type'] || null;

					return context.s3.upload(key, responseData, mimeType, true)
						.then(() => {
							logger.debug('Uploaded response data to S3 at [', key, ']');

							return context;
						});
				}).then((context) => {
					return context.s3.getSignedUrl('getObject', key, S3_TTL_FOR_SIGNED_URL_IN_SECONDS)
						.then((url) => {
							logger.debug('Retrieved signed URL for response data at [', key, ']');

							context.signedUrl = url;

							return context;
						});
				}).then((context) => {
					logger.info('Response uploaded to S3, sending HTTP 303 response referring to S3 object at [', key, ']');

					const headers = Object.assign({ }, responseHeaders);
					headers.Location = context.signedUrl;

					const response = LambdaResponseGenerator.buildResponseForApiGateway(303, headers, null);
					delete response.body;

					return response;
				}).catch((error) => {
					logger.error('Failed to upload response data to S3', error);

					return null;
				});
		}

		toString() {
			return '[LambdaResponseGeneratorForS3]';
		}
	}

	let s3ProviderPromise = null;

	function getS3Provider() {
		if (s3ProviderPromise === null) {
			s3ProviderPromise = Promise.resolve()
				.then(() => {
					const provider = new S3Provider({ region: process.env.S3_LARGE_HTTP_RESPONSE_REGION || 'us-east-1', bucket: process.env.S3_LARGE_HTTP_RESPONSE_BUCKET || 'barchart-aws-lambda-responses' });

					return provider.start().then(() => provider);
				});
		}

		return s3ProviderPromise;
	}

	return LambdaResponseGeneratorForS3;
})();
