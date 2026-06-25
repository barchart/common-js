import * as assert from '@barchart/common-js/lang/assert.js';

import Endpoint from './../../Endpoint.js';

/**
 * Provides socket request endpoint behavior.
 *
 * @public
 */
export default class SocketRequestEndpoint extends Endpoint {
	#channel;

	/**
	 * @param {*} channel - The channel.
	 * @param {*} executionCommand - The execution command.
	 * @param {*} validationCommand - The validation command.
	 */
	constructor(channel, executionCommand, validationCommand) {
		super(executionCommand, validationCommand);

		assert.argumentIsRequired(channel, 'channel', String);

		this.#channel = channel;
	}

	/**
	 * Returns the channel.
	 *
	 * @public
	 * @returns {string}
	 */
	getChannel() {
		return this.#channel;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[SocketRequestEndpoint]';
	}
}
