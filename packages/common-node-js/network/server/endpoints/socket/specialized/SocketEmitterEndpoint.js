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
	constructor(channel, event, eventType, roomCommand) {
		super(emptyCommand);

		assert.argumentIsRequired(channel, 'channel', String);
		assert.argumentIsRequired(event, 'event', Event, 'Event');
		assert.argumentIsRequired(eventType, 'eventType', String);
		assert.argumentIsOptional(roomCommand, 'roomCommand', CommandHandler, 'CommandHandler');

		this._channel = channel;
		this._event = event;
		this._eventType = eventType || null;
		this._roomCommand = roomCommand || broadcastCommand;
	}

	getChannel() {
		return this._channel;
	}

	getEvent() {
		return this._event;
	}

	getEventType() {
		return this._eventType;
	}

	getRoomCommand() {
		return this._roomCommand;
	}

	toString() {
		return '[SocketEmitterEndpoint]';
	}
}
