const assert = require('./../lang/assert');

module.exports = (() => {
	'use strict';

	class CommandHandler {
		constructor() {
		}

		process(data) {
			return this._process(data);
		}

		_process(data) {
			return true;
		}

		toString() {
			return '[CommandHandler]';
		}

		static toFunction(commandHandler) {
			assert.argumentIsRequired(commandHandler, 'commandHandler', CommandHandler, 'CommandHandler');

			return (data) => {
				return commandHandler.process(data);
			};
		}

		static fromFunction(handler) {
			assert.argumentIsRequired(handler, 'handler', Function);

			return new DelegateCommandHandler(handler);
		}
	}

	class DelegateCommandHandler extends CommandHandler {
		constructor(handler) {
			super();

			this._handler = handler;
		}

		_process(data) {
			return this._handler(data);
		}
	}

	return CommandHandler;
})();