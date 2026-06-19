import * as assert from '@barchart/common-js/lang/assert.js';

import Endpoint from './../Endpoint.js';
import RestAction from './RestAction.js';

export default class RestEndpoint extends Endpoint {
	#action;
	#path;

	/**
	 * @param {*} action
	 * @param {string} path
	 * @param {Function} command
	 * @param {*} validationCommand
	 */
	constructor(action, path, command, validationCommand) {
		super(command, validationCommand);

		assert.argumentIsRequired(action, 'action', RestAction, 'RestAction');
		assert.argumentIsRequired(path, 'path', String);

		this.#action = action;
		this.#path = path;
	}

	/**
	 * Returns the rest action.
	 *
	 * @public
	 * @returns {*}
	 */
	getRestAction() {
		return this.#action;
	}

	/**
	 * Returns the path.
	 *
	 * @public
	 * @returns {string}
	 */
	getPath() {
		return this.#path;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[RestEndpoint]';
	}
}
