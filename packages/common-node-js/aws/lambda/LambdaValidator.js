import * as is from '@barchart/common-js/lang/is.js';

import LambdaTriggerType from './LambdaTriggerType.js';

// 2020/11/29, BRI. This class will be removed in the next major version.
// It will be replaced with the "LambdaEventValidator" ...

/**
 * Evaluates a Lambda event, checking the messages it contains to determine
 * which are valid for processing.
 *
 * @public
 */
export default class LambdaValidator {
	constructor() {

	}

	/**
	 * Checks messages contained within a Lambda event for validity.
	 *
	 * @public
	 * @async
	 * @param {object} event
	 * @return {Promise<boolean>}
	 */
	async validate(event) {
		let messages;

		if (is.array(event.Records)) {
			messages = event.Records;
		} else {
			messages = [ event ];
		}

		const results = await Promise.all(messages.map((message) => {
			const trigger = LambdaTriggerType.fromMessage(message);

			let messageId;

			if (trigger !== null) {
				messageId = trigger.getId(message);
			} else {
				messageId = null;
			}

			if (trigger !== null && messageId !== null) {
				return this._validate(process.env.AWS_LAMBDA_FUNCTION_NAME, trigger, messageId);
			}

			return true;
		}));

		return results.every(r => r === true);
	}

	/**
	 * @protected
	 * @param {string} name
	 * @param {LambdaTriggerType} trigger
	 * @param {string} messageId
	 * @returns {boolean|Promise<boolean>}
	 */
	_validate(name, trigger, messageId) {
		return true;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[LambdaValidator]';
	}
}
