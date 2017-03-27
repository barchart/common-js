const assert = require('./../lang/assert'),
	CommandHandler = require('./CommandHandler');

module.exports = (() => {
	'use strict';

	class CompositeCommandHandler extends CommandHandler {
		constructor(commandHandlerA, commandHandlerB) {
			super();

			assert.argumentIsRequired(commandHandlerA, 'commandHandlerA', CommandHandler, 'CommandHandler');
			assert.argumentIsRequired(commandHandlerB, 'commandHandlerB', CommandHandler, 'CommandHandler');
			assert.areNotEqual(commandHandlerA, commandHandlerB, 'commandHandlerA', 'commandHandlerB');

			this._commandHandlerA = commandHandlerA;
			this._commandHandlerB = commandHandlerB;
		}

		_process(data) {
			return this._commandHandlerA.process(data) && this._commandHandlerB.process(data);
		}

		toString() {
			return '[CompositeCommandHandler]';
		}
	}

	return CompositeCommandHandler;
})();