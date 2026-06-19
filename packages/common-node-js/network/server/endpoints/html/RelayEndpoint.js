import * as assert from '@barchart/common-js/lang/assert.js';

import CommandHandler from '@barchart/common-js/commands/CommandHandler.js';

import Endpoint from './../Endpoint.js';
import Verb from './../../../http/Verb.js';

const emptyCommand = CommandHandler.fromFunction((ignored) => {
	return {};
});

export default class RelayEndpoint extends Endpoint {
	#acceptPath;
	#forwardHost;
	#forwardPath;
	#headerOverrides;
	#parameterOverrides;
	#verb;

	/**
	 * @param {*} verb
	 * @param {*} acceptPath
	 * @param {*} forwardHost
	 * @param {*} forwardPath
	 * @param {*} headerOverrides
	 * @param {*} parameterOverrides
	 */
	constructor(verb, acceptPath, forwardHost, forwardPath, headerOverrides, parameterOverrides) {
		super(emptyCommand);

		assert.argumentIsRequired(verb, 'verb', Verb, 'Verb');
		assert.argumentIsRequired(acceptPath, 'acceptPath', String);
		assert.argumentIsRequired(forwardHost, 'forwardHost', String);
		assert.argumentIsRequired(forwardPath, 'forwardPath', String);
		assert.argumentIsOptional(headerOverrides, 'headerOverrides', Object);
		assert.argumentIsOptional(parameterOverrides, 'parameterOverrides', Object);

		this.#verb = verb;

		this.#acceptPath = acceptPath;

		this.#forwardHost = forwardHost;
		this.#forwardPath = forwardPath;

		this.#headerOverrides = headerOverrides || { };
		this.#parameterOverrides = parameterOverrides || { };
	}

	/**
	 * Returns the verb.
	 *
	 * @public
	 * @returns {*}
	 */
	getVerb() {
		return this.#verb;
	}

	/**
	 * Returns the accept path.
	 *
	 * @public
	 * @returns {string}
	 */
	getAcceptPath() {
		return this.#acceptPath;
	}

	/**
	 * Returns the forward host.
	 *
	 * @public
	 * @returns {string}
	 */
	getForwardHost() {
		return this.#forwardHost;
	}

	/**
	 * Returns the forward path.
	 *
	 * @public
	 * @returns {string}
	 */
	getForwardPath() {
		return this.#forwardPath;
	}

	/**
	 * Returns the header overrides.
	 *
	 * @public
	 * @returns {object}
	 */
	getHeaderOverrides() {
		return this.#headerOverrides;
	}

	/**
	 * Returns the parameter overrides.
	 *
	 * @public
	 * @returns {object}
	 */
	getParameterOverrides() {
		return this.#parameterOverrides;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[RelayEndpoint]';
	}
}
