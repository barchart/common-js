import * as assert from '@barchart/common-js/lang/assert.js';

import CommandHandler from '@barchart/common-js/commands/CommandHandler.js';

export default class Endpoint {
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
