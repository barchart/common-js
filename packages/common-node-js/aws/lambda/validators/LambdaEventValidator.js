const log4js = require('log4js');

const assert = require('@barchart/common-js/lang/assert'),
	is = require('@barchart/common-js/lang/is');

const LambdaTriggerType = require('./../LambdaTriggerType'),
	LambdaMessageValidator = require('./LambdaMessageValidator'),
	LambdaValidator = require('./../LambdaValidator');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('common-node/aws/lambda/validators/LambdaEventValidator');

	// 2020/11/29, BRI. Inheriting the LambdaValidator is a hack. The LambdaValidator
	// is scheduled for removal in the next major release. For now, the inheritance
	// is only intended to maintain backwards compatibility for type checking purposes.

	/**
	 * Evaluates the input to a Lambda Function to determine if processing should be
	 * allowed. This is accomplished by examining each message (an event can contain
	 * one or more messages). If any message is deemed invalid, the entire event is
	 * deemed invalid.
	 *
	 * @public
	 */
	class LambdaEventValidator extends LambdaValidator {
		constructor(messageValidators) {
			super();

			if (messageValidators) {
				assert.argumentIsArray(messageValidators, 'messageValidators', LambdaMessageValidator, 'LambdaMessageValidator');
			}

			this._messageValidators = messageValidators || [ ];
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

			this._messageValidators.push(messageValidator);
		}

		/**
		 * Checks messages contained within a Lambda event for validity.
		 *
		 * @public
		 * @async
		 * @override
		 * @param {Object} event
		 * @returns {Promise<Boolean>}
		 */
		async validate(event) {
			return Promise.resolve()
				.then(() => {
					if (this._messageValidators.length === 0) {
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

					const validateMessage = (message) => {
						const trigger = LambdaTriggerType.fromMessage(message);

						let messageId;

						if (trigger) {
							messageId = trigger.getId(message);
						} else {
							messageId = null;
						}

						const promises = this._messageValidators.map((messageValidator, i) => {
							return messageValidator.validate(name, message, event, trigger, messageId)
								.then((valid) => {
									if (!valid) {
										logger.warn(`Message rejected by validator [ ${i.toString()} ] [ ${messageValidator.toString()} ]`);
									}

									return valid;
								});
						});

						return checkValidationPromises(promises);
					};

					const validateEvent = () => {
						const promises = messages.map((message) => {
							return validateMessage(message);
						});

						return checkValidationPromises(promises);
					};

					return validateEvent();
				});
		}

		toString() {
			return '[LambdaEventValidator]';
		}
	}

	function checkValidationPromises(promise) {
		return Promise.all(promise)
			.then((results) => {
				return results.every(r => r === true);
			});
	}

	return LambdaEventValidator;
})();