import * as assert from './../lang/assert.js';

/**
 * An object that can perform an action.
 *
 * @public
 */
export default class CommandHandler {
	constructor() {

	}

	/**
	 * Execute the action.
	 *
	 * @public
	 * @param {*} data
	 * @returns {*}
	 */
	process(data) {
		return this._process(data);
	}

	/**
	 * @protected
	 * @param {*} data
	 * @returns {*}
	 */
	_process(data) {
		return true;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[CommandHandler]';
	}

	/**
	 * Returns a function which executes the command.
	 *
	 * @public
	 * @static
	 * @param {CommandHandler} commandHandler
	 * @returns {Function}
	 */
	static toFunction(commandHandler) {
		assert.argumentIsRequired(commandHandler, 'commandHandler', CommandHandler, 'CommandHandler');

		return (data) => {
			return commandHandler.process(data);
		};
	}

	/**
	 * Returns a {@link CommandHandler} that delegates execution to a function.
	 *
	 * @public
	 * @static
	 * @param {Function} handler - The function which the command delegates to.
	 * @returns {CommandHandler}
	 */
	static fromFunction(handler) {
		assert.argumentIsRequired(handler, 'handler', Function);

		return new DelegateCommandHandler(handler);
	}
}

class DelegateCommandHandler extends CommandHandler {
	#handler;

	/**
     * @param {Function} handler
     */
	constructor(handler) {
		super();

		this.#handler = handler;
	}

	/**
	 * @protected
	 * @override
	 * @param {*} data
	 * @returns {*}
	 */
	_process(data) {
		return this.#handler(data);
	}
}
