const assert = require('@barchart/common-js/lang/assert');

const Endpoint = require('./../../Endpoint');

module.exports = (() => {
	'use strict';

	class SocketRequestEndpoint extends Endpoint {
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

	return SocketRequestEndpoint;
})();