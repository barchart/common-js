const aws = require('aws-sdk'),
	log4js = require('log4js');

const assert = require('@barchart/common-js/lang/assert'),
	Enum = require('@barchart/common-js/lang/Enum');

const LambdaEventParser = require('./LambdaEventParser'),
	LambdaResponder = require('./LambdaResponder'),
	LambdaSecretsManager = require('./LambdaSecretsManager'),
	LambdaStage = require('./LambdaStage');

const FailureReason = require('@barchart/common-js/api/failures/FailureReason'),
	FailureType = require('@barchart/common-js/api/failures/FailureType'),
	LambdaFailureType = require('./LambdaFailureType');

const LambdaValidator = require('./LambdaValidator');

module.exports = (() => {
	'use strict';

	/**
	 * Basic utility for processing a Lambda Function.
	 *
	 * @public
	 */
	class LambdaHelper {
		constructor() {

		}

		/**
		 * Configures and returns a log4js logger.
		 *
		 * @public
		 * @static
		 * @param {Object|String=} configuration - Configuration path (as string) or configuration data (as an object).
		 * @returns {Object}
		 */
		static getLogger(configuration) {
			if (lambdaLogger === null) {
				log4js.configure(configuration);

				lambdaLogger = log4js.getLogger('LambdaHelper');
				eventLogger = log4js.getLogger('LambdaHelper/Event');

				const awsLogger = log4js.getLogger('aws-sdk');

				const awsLogWrapper = { };

				awsLogWrapper.log = (message) => {
					if (awsLogger.isDebugEnabled()) {
						awsLogger.debug(message);
					}
				};

				aws.config.logger = awsLogWrapper;
			}

			return lambdaLogger;
		}

		/**
		 * Returns secret value from AWS Secrets Manager.
		 *
		 * @public
		 * @static
		 * @async
		 * @param {String} secretId
		 * @return {Promise<String>}
		 */
		static async getSecretValue(secretId) {
			return LambdaSecretsManager.INSTANCE.getValue(secretId);
		}

		/**
		 * Builds and returns a new {@link LambdaEventParser}.
		 *
		 * @public
		 * @static
		 * @param {Object} event
		 * @returns {LambdaEventParser}
		 */
		static getEventParser(event) {
			return new LambdaEventParser(event);
		}

		/**
		 * Builds and returns a new {@link LambdaValidator}.
		 *
		 * @public
		 * @static
		 * @returns {LambdaValidator}
		 */
		static getValidator() {
			return new LambdaValidator();
		}

		/**
		 * Builds and returns a new {@link LambdaResponder}.
		 *
		 * @public
		 * @static
		 * @param {Function} callback
		 * @returns {LambdaResponder}
		 */
		static getResponder(callback) {
			return new LambdaResponder(callback);
		}

		/**
		 * Builds and returns a new {@link LambdaStage}.
		 *
		 * @public
		 * @static
		 * @param {String} stage
		 * @returns {LambdaStage}
		 */
		static getStage(stage) {
			assert.argumentIsRequired(stage, 'stage', String);

			return Enum.fromCode(LambdaStage, stage);
		}

		/**
		 * Starts a promise chain for the Lambda function, invoking the suppressor, then
		 * the processor, and responding with the processor's result.
		 *
		 * @public
		 * @static
		 * @async
		 * @param {String} description - Human-readable description of the Lambda Function.
		 * @param {Object} event - The actual "event" object passed to the Lambda Function by the AWS framework.
		 * @param {Function} callback - The actual "callback" function passed to the Lambda Function by the AWS framework.
		 * @param {Callbacks.LambdaProcessorCallback} processor - The processor that is invoked to perform the work.
		 * @returns {Promise<*>}
		 */
		static async process(description, event, callback, processor) {
			const context = { };

			try {
				assert.argumentIsRequired(description, 'description', String);
				assert.argumentIsRequired(processor, 'processor', Function);

				context.parser = LambdaHelper.getEventParser(event);
				context.responder = LambdaHelper.getResponder(callback);

				if (context.parser.plainText) {
					context.responder.setPlainText();
				}

				if (eventLogger && eventLogger.isTraceEnabled()) {
					eventLogger.trace(JSON.stringify(event, null, 2));
				}

				const validator = LambdaHelper.getValidator();
				const valid = await validator.validate(event);

				if (!valid) {
					throw FailureReason.from(LambdaFailureType.LAMBDA_INVOCATION_SUPPRESSED);
				}

				const response = await processor(context.parser, context.responder);

				return await context.responder.send(response);
			} catch (e) {
				let reason;

				if (e instanceof FailureReason) {
					reason = e;

					if (lambdaLogger) {
						if (reason.getIsSevere()) {
							lambdaLogger.error(reason.format());
						} else {
							lambdaLogger.warn(reason.format());
						}
					}
				} else {
					reason = new FailureReason({ endpoint: { description } });
					reason = reason.addItem(FailureType.REQUEST_GENERAL_FAILURE);

					if (lambdaLogger) {
						lambdaLogger.error(e);
					}
				}

				if (eventLogger && !eventLogger.isTraceEnabled()) {
					eventLogger.warn(JSON.stringify(event, null, 2));
				}

				return await context.responder.sendError(reason, reason.getErrorCode());
			}
		}

		/**
		 * Starts a promise chain for the Lambda function, invoking the suppressor, then
		 * the processor, and responding with the processor's result.
		 *
		 * @public
		 * @static
		 * @async
		 * @param {String} description - Human-readable description of the Lambda Function.
		 * @param {Object} event - The actual "event" object passed to the Lambda Function by the AWS framework.
		 * @param {Callbacks.LambdaProcessorCallback} processor - The processor that is invoked to perform the work.
		 * @returns {Promise<*>}
		 */
		static async processAsync(description, event, processor) {
			return LambdaHelper.process(description, event, () => { }, processor);
		}

		toString() {
			return '[ LambdaHelper ]';
		}
	}

	let lambdaLogger = null;
	let eventLogger = null;

	return LambdaHelper;
})();
