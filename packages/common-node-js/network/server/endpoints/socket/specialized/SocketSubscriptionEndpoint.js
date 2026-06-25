import * as assert from '@barchart/common-js/lang/assert.js';

import CommandHandler from '@barchart/common-js/commands/CommandHandler.js';

import Endpoint from './../../Endpoint.js';

const emptyCommand = CommandHandler.fromFunction(() => null);

/**
 * Provides socket subscription endpoint behavior.
 *
 * @public
 */
export default class SocketSubscriptionEndpoint extends Endpoint {
	#channel;
	#responseCommand;
	#responseEventType;
	#roomsCommand;

	/**
	 * @param {*} channel - The channel.
	 * @param {*} roomsCommand - The rooms command.
	 * @param {*} responseCommand - The response command.
	 * @param {*} responseEventType - The response event type.
	 * @param {*} validationCommand - The validation command.
	 */
	constructor(channel, roomsCommand, responseCommand, responseEventType, validationCommand) {
		super(emptyCommand, validationCommand);

		assert.argumentIsRequired(channel, 'channel', String);
		assert.argumentIsRequired(roomsCommand, 'roomsCommand', CommandHandler, 'CommandHandler');
		assert.argumentIsOptional(responseCommand, 'responseCommand', CommandHandler, 'CommandHandler');
		assert.argumentIsOptional(responseEventType, 'responseEventType', String);

		this.#channel = channel;
		this.#roomsCommand = roomsCommand;

		this.#responseCommand = responseCommand || emptyCommand;
		this.#responseEventType = responseEventType || '';
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
	 * Returns the rooms command.
	 *
	 * @public
	 * @returns {Function}
	 */
	getRoomsCommand() {
		return this.#roomsCommand;
	}

	/**
	 * Returns the response command.
	 *
	 * @public
	 * @returns {Function}
	 */
	getResponseCommand() {
		return this.#responseCommand;
	}

	/**
	 * Returns the response event type.
	 *
	 * @public
	 * @returns {*}
	 */
	getResponseEventType() {
		return this.#responseEventType;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[SocketSubscriptionEndpoint]';
	}
}
