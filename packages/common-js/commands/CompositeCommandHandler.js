import * as assert from './../lang/assert.js';

import CommandHandler from './CommandHandler.js';

export default class CompositeCommandHandler extends CommandHandler {
	#commandHandlerA;
	#commandHandlerB;

	/**
	 * @param {*} commandHandlerA
	 * @param {*} commandHandlerB
	 */
	constructor(commandHandlerA, commandHandlerB) {
		super();

		assert.argumentIsRequired(commandHandlerA, 'commandHandlerA', CommandHandler, 'CommandHandler');
		assert.argumentIsRequired(commandHandlerB, 'commandHandlerB', CommandHandler, 'CommandHandler');
		assert.areNotEqual(commandHandlerA, commandHandlerB, 'commandHandlerA', 'commandHandlerB');

		this.#commandHandlerA = commandHandlerA;
		this.#commandHandlerB = commandHandlerB;
	}

	/**
	 * @protected
	 * @override
	 * @param {*} data
	 * @returns {*}
	 */
	_process(data) {
		return this.#commandHandlerA.process(data) && this.#commandHandlerB.process(data);
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[CompositeCommandHandler]';
	}
}
