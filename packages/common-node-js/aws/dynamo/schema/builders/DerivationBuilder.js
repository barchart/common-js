const is = require('@barchart/common-js/lang/is');

const Attribute = require('./../definitions/Attribute'),
	Derivation = require('./../definitions/Derivation');

module.exports = (() => {
	'use strict';

	/**
	 * Fluent interface for building a {@link Derivation}.
	 *
	 * @public
	 * @param {string} name
	 * @param {TableBuilder} parent
	 */
	class DerivationBuilder {
		constructor(parent) {
			this._derivation = null;
			this._parent = parent;
		}

		/**
		 * The {@link Derivation}, given all the information provided thus far.
		 *
		 * @public
		 * @returns {Derivation}
		 */
		get derivation() {
			return this._derivation;
		}

		/**
		 * Adds a table attribute as a dependency for the derivation. The value of this
		 * attribute will be passed the generator function.
		 *
		 * @public
		 * @param {String} attribute - The name of the {@link Attribute} to use in the derivation.
		 * @param {Boolean=} optional - If true, the derivation will be processed (even if the attribute is absent).
		 * @returns {DerivationBuilder}
		 */
		withAttribute(attribute, optional) {
			const a = getAttribute(attribute, this._parent);
			const o = is.boolean(optional) && optional;

			let attributes;
			let generator;
			let optionalities;

			if (this._derivation) {
				attributes = this._derivation.attributes.concat([ a ]);
				optionalities = this._derivation.optionalities.concat([  o ]);
				generator = this._derivation.generator;
			} else {
				attributes = [ a ];
				optionalities = [ o ];
				generator = null;
			}

			this._derivation = new Derivation(attributes, generator, optionalities);

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

			if (this._derivation) {
				attributes = this._derivation.attributes;
				optionalities = this._derivation.optionalities;
			} else {
				attributes = [ ];
				optionalities = [ ];
			}

			this._derivation = new Derivation(attributes, generator, optionalities);

			return this;
		}

		toString() {
			return '[DerivationBuilder]';
		}
	}

	function getAttribute(name, parent) {
		return parent.table.attributes.find(a => a.name === name) || null;
	}

	return DerivationBuilder;
})();