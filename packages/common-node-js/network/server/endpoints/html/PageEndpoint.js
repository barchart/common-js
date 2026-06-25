import * as assert from '@barchart/common-js/lang/assert.js';

import CommandHandler from '@barchart/common-js/commands/CommandHandler.js';

import Endpoint from './../Endpoint.js';
import Verb from './../../../http/Verb.js';

const emptyCommand = CommandHandler.fromFunction((ignored) => {
	return {};
});

/**
 * Provides page endpoint behavior.
 *
 * @public
 */
export default class PageEndpoint extends Endpoint {
	#acceptFile;
	#cache;
	#path;
	#secureRedirect;
	#template;
	#verb;

	/**
	 * @param {*} verb - The verb.
	 * @param {string} path - The path.
	 * @param {*} template - The template.
	 * @param {Function} command - The command.
	 * @param {*} cache - The cache.
	 * @param {*} acceptFile - The accept file.
	 * @param {*} secureRedirect - The secure redirect.
	 */
	constructor(verb, path, template, command, cache, acceptFile, secureRedirect) {
		super(command || emptyCommand);

		assert.argumentIsRequired(verb, 'verb', Verb, 'Verb');
		assert.argumentIsRequired(path, 'path', String);
		assert.argumentIsRequired(template, 'template', String);
		assert.argumentIsOptional(cache, 'cache', Boolean);
		assert.argumentIsOptional(acceptFile, 'acceptFile', Boolean);
		assert.argumentIsOptional(secureRedirect, 'secureRedirect', Boolean);

		this.#verb = verb;
		this.#path = path;
		this.#template = template;
		this.#cache = cache || false;
		this.#acceptFile = acceptFile || false;
		this.#secureRedirect = secureRedirect || false;
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
	 * Returns the path.
	 *
	 * @public
	 * @returns {string}
	 */
	getPath() {
		return this.#path;
	}

	/**
	 * Returns the template.
	 *
	 * @public
	 * @returns {string}
	 */
	getTemplate() {
		return this.#template;
	}

	/**
	 * Returns the cache.
	 *
	 * @public
	 * @returns {boolean}
	 */
	getCache() {
		return this.#cache;
	}

	/**
	 * Returns the accept file.
	 *
	 * @public
	 * @returns {boolean}
	 */
	getAcceptFile() {
		return this.#acceptFile;
	}

	/**
	 * Returns the secure redirect.
	 *
	 * @public
	 * @returns {boolean}
	 */
	getSecureRedirect() {
		return this.#secureRedirect;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[PageEndpoint]';
	}
}
