const assert = require('@barchart/common-js/lang/assert'),
	CommandHandler = require('@barchart/common-js/commands/CommandHandler');

module.exports = (() => {
	'use strict';

	class Endpoint {
		constructor(executionCommand, validationCommand) {
			assert.argumentIsRequired(executionCommand, 'executionCommand', CommandHandler, 'CommandHandler');
			assert.argumentIsOptional(validationCommand, 'validationCommand', CommandHandler, 'CommandHandler');

			this._executionCommand = executionCommand;
			this._validationCommand = validationCommand || emptyValidationCommand;
		}

		getExecutionCommand() {
			return this._executionCommand;
		}

		getValidationCommand() {
			return this._validationCommand;
		}

		toString() {
			return '[Endpoint]';
		}
	}

	const emptyValidationCommand = CommandHandler.fromFunction((context) => true);

	return Endpoint;
})();