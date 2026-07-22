import * as assert from '@barchart/common-js/lang/assert.js';

import Enum from '@barchart/common-js/lang/Enum.js';
import FailureReason from '@barchart/common-js/api/failures/FailureReason.js';
import FailureType from '@barchart/common-js/api/failures/FailureType.js';

import LambdaEventParser from './LambdaEventParser.js';
import LambdaResponder from './LambdaResponder.js';
import LambdaSecretsManager from './LambdaSecretsManager.js';
import LambdaStage from './LambdaStage.js';
import LambdaFailureType from './LambdaFailureType.js';
import LambdaEventValidator from './validators/LambdaEventValidator.js';

import log4js from 'log4js';

/**
 * Basic utility for processing a Lambda Function.
 *
 * @public
 */
export default class LambdaHelper {
	constructor() {

	}

	/**
	 * Configures and returns a log4js logger.
	 *
	 * @public
	 * @static
	 * @param {object|string=} configuration - Configuration path (as string) or configuration data (as an object).
	 * @returns {object}
	 */
	static getLogger(configuration) {
		if (lambdaLogger === null) {
			log4js.configure(configuration);

			lambdaLogger = log4js.getLogger('LambdaHelper');
			eventLogger = log4js.getLogger('LambdaHelper/Event');

		}

		return lambdaLogger;
	}

	/**
	 * Returns secret value from AWS Secrets Manager.
	 *
	 * @public
	 * @static
	 * @async
	 * @param {string} secretId
	 * @returns {Promise<string>}
	 */
	static async getSecretValue(secretId) {
		return LambdaSecretsManager.INSTANCE.getValue(secretId);
	}

	/**
	 * Builds and returns a new {@link LambdaEventParser}.
	 *
	 * @public
	 * @static
	 * @param {object} event
	 * @returns {LambdaEventParser}
	 */
	static getEventParser(event) {
		return new LambdaEventParser(event);
	}

	/**
	 * Builds and returns a new {@link LambdaEventValidator}.
	 *
	 * @public
	 * @static
	 * @returns {LambdaEventValidator}
	 */
	static getValidator() {
		return new LambdaEventValidator();
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
	 * @param {string} stage
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
	 * @param {string} description - Human-readable description of the Lambda Function.
	 * @param {object} event - The actual "event" object passed to the Lambda Function by the AWS framework.
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

			return context.responder.sendError(reason, reason.getErrorCode());
		}
	}

	/**
	 * Starts a promise chain for the Lambda function, invoking the suppressor, then
	 * the processor, and responding with the processor's result.
	 *
	 * @public
	 * @static
	 * @async
	 * @param {string} description - Human-readable description of the Lambda Function.
	 * @param {object} event - The actual "event" object passed to the Lambda Function by the AWS framework.
	 * @param {Callbacks.LambdaProcessorCallback} processor - The processor that is invoked to perform the work.
	 * @returns {Promise<*>}
	 */
	static async processAsync(description, event, processor) {
		return LambdaHelper.process(description, event, () => { }, processor);
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[ LambdaHelper ]';
	}
}

let lambdaLogger = null;
let eventLogger = null;
