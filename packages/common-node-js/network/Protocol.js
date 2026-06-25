import * as assert from '@barchart/common-js/lang/assert.js';

/**
 * Provides protocol behavior.
 *
 * @public
 */
export default class Protocol {
	#description;
	#secure;
	#standard;

	/**
	 * @param {string} description - The description.
	 * @param {string} standard - The standard.
	 * @param {string} secure - The secure.
	 */
	constructor(description, standard, secure) {
		assert.argumentIsRequired(description, 'description', String);
		assert.argumentIsRequired(standard, 'standard', String);
		assert.argumentIsRequired(secure, 'secure', String);

		this.#description = description;

		this.#standard = standard;
		this.#secure = secure;
	}

	/**
	 * Returns the description.
	 *
	 * @public
	 * @returns {string}
	 */
	getDescription() {
		return this.#description;
	}

	/**
	 * Returns the standard.
	 *
	 * @public
	 * @returns {string}
	 */
	getStandard() {
		return this.#standard;
	}

	/**
	 * Returns the secure.
	 *
	 * @public
	 * @returns {string}
	 */
	getSecure() {
		return this.#secure;
	}

	/**
	 * Returns the url prefix.
	 *
	 * @public
	 * @param {boolean=} secure
	 * @returns {string}
	 */
	getUrlPrefix(secure) {
		let prefix;

		if (secure) {
			prefix = this.#secure;
		} else {
			prefix = this.#standard;
		}

		return prefix + '://';
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[Protocol (description=' + this.#description + ')]';
	}
}

function addProtocol(verb) {
	const code = verb.getDescription();

	Protocol[code] = verb;
}

addProtocol(new Protocol('HyperText', 'http', 'https'));
