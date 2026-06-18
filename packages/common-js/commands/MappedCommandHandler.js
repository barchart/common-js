import * as assert from './../lang/assert.js';

import CommandHandler from './CommandHandler.js';

export default class MappedCommandHandler extends CommandHandler {
	#handlerMap;
	#defaultHandler;
	#nameExtractor;

	/**
	 * @public
	 * @param {*} nameExtractor
	 */
	constructor(nameExtractor) {
		super();

		assert.argumentIsRequired(nameExtractor, 'nameFunction', Function);

		this.#handlerMap = { };
		this.#defaultHandler = null;

		this.#nameExtractor = nameExtractor;
	}

	/**
	 * @public
	 * @param {*} name
	 * @param {*} commandHandler
	 * @returns {MappedCommandHandler}
	 */
	addCommandHandler(name, commandHandler) {
		assert.argumentIsRequired(name, 'name', String);
		assert.argumentIsRequired(commandHandler, 'commandHandler', CommandHandler, 'CommandHandler');


		if (this.#handlerMap.hasOwnProperty(name)) {
			throw new Error('A handler with the same name already exists in the map');
		}

		if (commandHandler === this) {
			throw new Error('Recursive use of mapped command handlers is prohibited');
		}

		this.#handlerMap[name] = commandHandler;

		return this;
	}

	/**
	 * @public
	 * @param {*} commandHandler
	 * @returns {MappedCommandHandler}
	 */
	setDefaultCommandHandler(commandHandler) {
		assert.argumentIsRequired(commandHandler, 'commandHandler', CommandHandler, 'CommandHandler');

		this.#defaultHandler = commandHandler;

		return this;
	}

	/**
	 * @protected
	 * @override
	 * @param {*} data
	 * @returns {*}
	 */
	_process(data) {
		const handlerName = this.#nameExtractor(data);
		const handler = this.#handlerMap[handlerName] || this.#defaultHandler;

		let returnRef;

		if (handler) {
			returnRef = handler.process(data);
		} else {
			returnRef = null;
		}

		return returnRef;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[MappedCommandHandler]';
	}
}
