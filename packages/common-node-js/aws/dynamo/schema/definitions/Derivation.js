
/**
 * @typedef {import('./Attribute.js').default} Attribute
 */
/**
 * An attribute value can be derived from other attributes. This object
 * describes the input required and the function needed to derive an
 * attribute value.
 *
 * @public
 */
export default class Derivation {
	#attributes;
	#generator;
	#optionalities;

	/**
	 * @param {Array<Attribute>} attributes - The attributes used by the generator. Each attribute will be read, then passed to the generator as an array.
	 * @param {Function} generator - The function which derives (i.e. generates) the attribute value.
	 * @param {Array<boolean>} optionalities - Indicates if the attributes are allowed to be missing.
	 */
	constructor(attributes, generator, optionalities) {
		this.#attributes = attributes;
		this.#generator = generator;
		this.#optionalities = optionalities;
	}

	/**
	 * The attributes used by the {@link Derivation#generator} function.
	 *
	 * @public
	 * @returns {Array<Attribute>}
	 */
	get attributes() {
		return [...this.#attributes];
	}

	/**
	 * The function which derives the value.
	 *
	 * @public
	 * @returns {Function}
	 */
	get generator() {
		return this.#generator;
	}

	/**
	 * An array that indicates if attributes are allowed to be missing. Compare to
	 * the {@link Derivation#attributes} property on an index-by-index basis.
	 *
	 * @public
	 * @returns {Array<boolean>}
	 */
	get optionalities() {
		return [...this.#optionalities];
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[Derivation]';
	}
}
