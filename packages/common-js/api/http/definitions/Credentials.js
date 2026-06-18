import * as is from './../../../lang/is.js';

/**
 * Encapsulates credential detection logic.
 *
 * @public
 */
export default class Credentials {
	#usernameExtractor;
	#passwordExtractor;

	/**
	 * @param {Function=} usernameExtractor
	 * @param {Function=} passwordExtractor
	 */
	constructor(usernameExtractor, passwordExtractor) {
		this.#usernameExtractor = usernameExtractor;
		this.#passwordExtractor = passwordExtractor;
	}

	/**
	 * The password extractor.
	 *
	 * @public
	 * @returns {Function}
	 */
	get usernameExtractor() {
		return this.#usernameExtractor;
	}

	/**
	 * The password extractor.
	 *
	 * @public
	 * @returns {Function}
	 */
	get passwordExtractor() {
		return this.#passwordExtractor;
	}

	/**
	 * Throws an {@link Error} if the instance is invalid.
	 *
	 * @public
	 */
	validate() {
		if (!is.fn(this.usernameExtractor)) {
			throw new Error('Credentials username extractor must be a function.');
		}

		if (!is.fn(this.passwordExtractor)) {
			throw new Error('Credentials password extractor must be a function.');
		}
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return `[Credentials]`;
	}
}
