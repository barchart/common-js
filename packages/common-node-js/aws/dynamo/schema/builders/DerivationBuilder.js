import * as is from '@barchart/common-js/lang/is.js';

import Derivation from './../definitions/Derivation.js';

/**
 * @typedef {import('./TableBuilder.js').default} TableBuilder
 */

/**
 * Fluent interface for building a {@link Derivation}.
 *
 * @public
 */
export default class DerivationBuilder {
	#derivation;
	#parent;

	/**
	 * @param {TableBuilder} parent - The parent.
	 */
	constructor(parent) {
		this.#derivation = null;
		this.#parent = parent;
	}

	/**
	 * The {@link Derivation}, given all the information provided thus far.
	 *
	 * @public
	 * @returns {Derivation}
	 */
	get derivation() {
		return this.#derivation;
	}

	/**
	 * Adds a table attribute as a dependency for the derivation. The value of this
	 * attribute will be passed the generator function.
	 *
	 * @public
	 * @param {string} attribute - The name of the {@link Attribute} to use in the derivation.
	 * @param {boolean=} optional - If true, the derivation will be processed (even if the attribute is absent).
	 * @returns {DerivationBuilder}
	 */
	withAttribute(attribute, optional) {
		const a = getAttribute(attribute, this.#parent);
		const o = is.boolean(optional) && optional;

		let attributes;
		let generator;
		let optionalities;

		if (this.#derivation) {
			attributes = this.#derivation.attributes.concat([ a ]);
			optionalities = this.#derivation.optionalities.concat([  o ]);
			generator = this.#derivation.generator;
		} else {
			attributes = [ a ];
			optionalities = [ o ];
			generator = null;
		}

		this.#derivation = new Derivation(attributes, generator, optionalities);

		return this;
	}

	/**
	 * Adds the function used to derive the attribute value. The function will
	 * be passed an array of dependent attribute values (in the order they were
	 * added to the derivation builder).
	 *
	 * @public
	 * @param {Function} generator - The function used to derive the attribute's value.
	 * @returns {DerivationBuilder}
	 */
	withGenerator(generator) {
		let attributes;
		let optionalities;

		if (this.#derivation) {
			attributes = this.#derivation.attributes;
			optionalities = this.#derivation.optionalities;
		} else {
			attributes = [ ];
			optionalities = [ ];
		}

		this.#derivation = new Derivation(attributes, generator, optionalities);

		return this;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[DerivationBuilder]';
	}
}

function getAttribute(name, parent) {
	return parent.table.attributes.find(a => a.name === name) || null;
}
