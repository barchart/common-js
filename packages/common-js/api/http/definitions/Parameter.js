import * as is from './../../../lang/is.js';

/**
 * Encapsulates definition of a parameter -- that is, its name and
 * its value. Parameters are used in request paths, request bodies,
 * querystrings, and as request headers.
 *
 * @public
 */
export default class Parameter {
	#description;
	#key;
	#extractor;
	#optional;

	/**
	 * @param {string} description
	 * @param {string} key
	 * @param {parameterValueCallback} extractor
	 * @param {boolean=} optional
	 */
	constructor(description, key, extractor, optional) {
		this.#description = description || null;
		this.#key = key || null;
		this.#extractor = extractor || null;
		this.#optional = is.boolean(optional) && optional;
	}

	/**
	 * The human-readable description of the parameter.
	 *
	 * @public
	 * @returns {string}
	 */
	get description() {
		return this.#description;
	}

	/**
	 * The name of the parameter.
	 *
	 * @public
	 * @returns {string}
	 */
	get key() {
		return this.#key;
	}

	/**
	 * A function for extracting the parameter's value.
	 *
	 * @public
	 * @returns {parameterValueCallback}
	 */
	get extractor() {
		return this.#extractor;
	}

	/**
	 * Indicates if the parameter is required.
	 *
	 * @public
	 * @returns {boolean}
	 */
	get optional() {
		return this.#optional;
	}

	/**
	 * Throws an {@link Error} if the instance is invalid.
	 *
	 * @public
	 */
	validate() {
		if (!is.string(this.key) || this.key.length === 0) {
			throw new Error('Parameter key must be a non-zero length string');
		}

		if (!is.fn(this.#extractor)) {
			throw new Error('Parameter extractor must be a function.');
		}
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return `[Parameter]`;
	}
}

/**
 * A function that, when passed the request's payload, returns a parameter's value.
 *
 * @callback parameterValueCallback
 * @param {object} payload
 * @returns {Promise<string>}
 */
