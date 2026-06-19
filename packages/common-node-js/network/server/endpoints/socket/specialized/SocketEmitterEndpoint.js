import * as assert from '@barchart/common-js/lang/assert.js';

import CommandHandler from '@barchart/common-js/commands/CommandHandler.js';
import Event from '@barchart/common-js/messaging/Event.js';

import Endpoint from './../../Endpoint.js';

const emptyCommand = CommandHandler.fromFunction(() => {
	return;
});

const broadcastCommand = CommandHandler.fromFunction(() => {
	return null;
});

export default class SocketEmitterEndpoint extends Endpoint {
	#channel;
	#event;
	#eventType;
	#roomCommand;

	/**
	 * @param {*} channel
	 * @param {object} event
	 * @param {*} eventType
	 * @param {*} roomCommand
	 */
	constructor(channel, event, eventType, roomCommand) {
		super(emptyCommand);

		assert.argumentIsRequired(channel, 'channel', String);
		assert.argumentIsRequired(event, 'event', Event, 'Event');
		assert.argumentIsRequired(eventType, 'eventType', String);
		assert.argumentIsOptional(roomCommand, 'roomCommand', CommandHandler, 'CommandHandler');

		this.#channel = channel;
		this.#event = event;
		this.#eventType = eventType || null;
		this.#roomCommand = roomCommand || broadcastCommand;
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
	 * Returns the event.
	 *
	 * @public
	 * @returns {string}
	 */
	getEvent() {
		return this.#event;
	}

	/**
	 * Returns the event type.
	 *
	 * @public
	 * @returns {*}
	 */
	getEventType() {
		return this.#eventType;
	}

	/**
	 * Returns the room command.
	 *
	 * @public
	 * @returns {Function}
	 */
	getRoomCommand() {
		return this.#roomCommand;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[SocketEmitterEndpoint]';
	}
}
