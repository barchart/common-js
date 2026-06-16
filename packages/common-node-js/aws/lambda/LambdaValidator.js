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
	 * @param {Object} event
	 * @return {Promise<Boolean>}
	 */
	async validate(event) {
		return Promise.resolve()
			.then(() => {
				let messages;

				if (is.array(event.Records)) {
					messages = event.Records;
				} else {
					messages = [ event ];
				}
				
				return Promise.all(messages.map((message) => {
					const trigger = LambdaTriggerType.fromMessage(message);

					let messageId;

					if (trigger !== null) {
						messageId = trigger.getId(message);
					} else {
						messageId = null;
					}
					
					let validatePromise;
					
					if (trigger !== null && messageId !== null) {
						validatePromise = Promise.resolve(this._validate(process.env.AWS_LAMBDA_FUNCTION_NAME, trigger, messageId));
					} else {
						validatePromise = Promise.resolve(true);
					}
					
					return validatePromise;
				}));
			}).then((results) => {
				return results.every(r => r === true);
			});
	}

	/**
	 * @protected
	 * @param {String} name
	 * @param {LambdaTriggerType} trigger
	 * @param {String} messageId
	 * @returns {Boolean|Promise<Boolean>}
	 */
	_validate(name, trigger, messageId) {
		return true;
	}
	
	toString() {
		return '[LambdaValidator]';
	}
}
