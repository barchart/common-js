import * as assert from '@barchart/common-js/lang/assert.js';
import * as is from '@barchart/common-js/lang/is.js';

import LambdaTriggerType from './../LambdaTriggerType.js';
import LambdaMessageValidator from './LambdaMessageValidator.js';

import log4js from 'log4js';

const logger = log4js.getLogger('common-node/aws/lambda/validators/LambdaEventValidator');

/**
 * Evaluates the input to a Lambda Function to determine if processing should be
 * allowed. This is accomplished by examining each message (an event can contain
 * one or more messages). If any message is deemed invalid, the entire event is
 * deemed invalid.
 *
 * @public
 */
export default class LambdaEventValidator {
	#messageValidators;

	/**
	 * @param {LambdaMessageValidator[]=} messageValidators - The message validators.
	 */
	constructor(messageValidators) {
		if (messageValidators) {
			assert.argumentIsArray(messageValidators, 'messageValidators', LambdaMessageValidator, 'LambdaMessageValidator');
		}

		this.#messageValidators = messageValidators || [ ];
	}

	/**
	 * Adds a custom {@link LambdaMessageValidator}. Strategies will be
	 * processed in the order they are added.
	 *
	 * @public
	 * @param {LambdaMessageValidator} messageValidator
	 */
	addMessageValidator(messageValidator) {
		assert.argumentIsRequired(messageValidator, 'messageValidator', LambdaMessageValidator, 'LambdaMessageValidator');

		this.#messageValidators.push(messageValidator);
	}

	/**
	 * Checks messages contained within a Lambda event for validity.
	 *
	 * @public
	 * @async
	 * @override
	 * @param {object} event
	 * @returns {Promise<boolean>}
	 */
	async validate(event) {
		if (this.#messageValidators.length === 0) {
			return true;
		}

		let messages;

		if (is.array(event.Records)) {
			messages = event.Records;
		} else {
			messages = [event];
		}

		if (messages.length === 0) {
			return true;
		}

		const name = process.env.AWS_LAMBDA_FUNCTION_NAME;

		const validateMessage = async (message) => {
			const trigger = LambdaTriggerType.fromMessage(message);

			let messageId;

			if (trigger) {
				messageId = trigger.getId(message);
			} else {
				messageId = null;
			}

			const promises = this.#messageValidators.map(async (messageValidator, i) => {
				const valid = await messageValidator.validate(name, message, event, trigger, messageId);

				if (!valid) {
					logger.warn(`Message rejected by validator [ ${i.toString()} ] [ ${messageValidator.toString()} ]`);
				}

				return valid;
			});

			return checkValidationPromises(promises);
		};

		const promises = messages.map((message) => {
			return validateMessage(message);
		});

		return checkValidationPromises(promises);
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[LambdaEventValidator]';
	}
}

async function checkValidationPromises(promise) {
	const results = await Promise.all(promise);

	return results.every(r => r === true);
}
