import * as assert from '@barchart/common-js/lang/assert.js';

import CommandHandler from '@barchart/common-js/commands/CommandHandler.js';

export default class Endpoint {
	#executionCommand;
	#validationCommand;

	/**
	 * @param {*} executionCommand
	 * @param {*} validationCommand
	 */
	constructor(executionCommand, validationCommand) {
		assert.argumentIsRequired(executionCommand, 'executionCommand', CommandHandler, 'CommandHandler');
		assert.argumentIsOptional(validationCommand, 'validationCommand', CommandHandler, 'CommandHandler');

		this.#executionCommand = executionCommand;
		this.#validationCommand = validationCommand || emptyValidationCommand;
	}

	/**
	 * Returns the execution command.
	 *
	 * @public
	 * @returns {Function}
	 */
	getExecutionCommand() {
		return this.#executionCommand;
	}

	/**
	 * Returns the validation command.
	 *
	 * @public
	 * @returns {Function}
	 */
	getValidationCommand() {
		return this.#validationCommand;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[Endpoint]';
	}
}

const emptyValidationCommand = CommandHandler.fromFunction((context) => true);
