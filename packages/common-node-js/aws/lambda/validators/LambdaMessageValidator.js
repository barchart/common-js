import * as assert from '@barchart/common-js/lang/assert.js';

import LambdaTriggerType from './../LambdaTriggerType.js';

/**
 * Validates a "message" contained within an AWS Lambda event (some
 * events include multiple messages).
 *
 * @public
 * @abstract
 */
export default class LambdaMessageValidator {
	constructor() {

	}

	/**
	 * Validates a message.
	 *
	 * @public
	 * @async
	 * @param {string} name
	 * @param {object} message
	 * @param {object} event
	 * @param {LambdaTriggerType=} trigger
	 * @param {string=} messageId
	 * @returns {Promise<boolean>}
	 */
	async validate(name, message, event, trigger, messageId) {
		assert.argumentIsOptional(trigger, 'trigger', LambdaTriggerType, 'LambdaTriggerType');
		assert.argumentIsOptional(messageId, 'messageId', String);

		return this._validate(name, message, event, trigger, messageId);
	}

	/**
	 * @protected
	 * @abstract
	 * @param {string} name
	 * @param {object} message
	 * @param {object} event
	 * @param {LambdaTriggerType=} trigger
	 * @param {string=} messageId
	 * @returns {Promise<boolean>|boolean}
	 */
	_validate(name, message, event, trigger, messageId) {
		return true;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[LambdaMessageValidator]';
	}
}
