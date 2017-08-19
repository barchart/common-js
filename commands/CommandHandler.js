const assert = require('./../lang/assert');

module.exports = (() => {
	'use strict';

	/**
	 * An object that can perform an action.
	 *
	 * @public
	 * @interface
	 */
	class CommandHandler {
		constructor() {
		}

		/**
		 * Execute the action.
		 *
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

		toString() {
			return '[CommandHandler]';
		}

		/**
		 * Returns a function which executes the command.
		 *
		 * @public
		 * @param {CommandHandler} commandHandler
		 * @returns {function(*=)}
		 */
		static toFunction(commandHandler) {
			assert.argumentIsRequired(commandHandler, 'commandHandler', CommandHandler, 'CommandHandler');

			return (data) => {
				return commandHandler.process(data);
			};
		}

		/**
		 * Returns a {@link CommandHandler} that where execution is delegated
		 * to a function.
		 *
		 * @public
		 * @param {Function} handler - The function which the command delegates to.
		 * @returns {CommandHandler}
		 */
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