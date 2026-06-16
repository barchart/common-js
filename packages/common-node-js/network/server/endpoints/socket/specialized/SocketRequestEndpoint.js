import * as assert from '@barchart/common-js/lang/assert.js';

import Endpoint from './../../Endpoint.js';

export default class SocketRequestEndpoint extends Endpoint {
	constructor(channel, executionCommand, validationCommand) {
		super(executionCommand, validationCommand);

		assert.argumentIsRequired(channel, 'channel', String);

		this._channel = channel;
	}

	getChannel() {
		return this._channel;
	}

	toString() {
		return '[SocketRequestEndpoint]';
	}
}
