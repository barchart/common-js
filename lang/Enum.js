const assert = require('./assert'),
	is = require('./is');

module.exports = (() => {
	'use strict';

	const types = new Map();

	/**
	 * An enumeration. Must be inherited. Do not instantiate directly.
	 * Also, this class uses the ES6 Map, therefore a polyfill must
	 * be supplied.
	 *
	 * @public
	 * @interface
	 * @param {String} code - The unique code of the enumeration item.
	 * @param {String} description - A description of the enumeration item.
	 * @param {Number=} mapping - An alternate key value (used when external systems identify enumeration items using integer values).
	 */
	class Enum {
		constructor(code, description, mapping) {
			assert.argumentIsRequired(code, 'code', String);
			assert.argumentIsRequired(description, 'description', String);
			assert.argumentIsOptional(mapping, 'mapping', Number);

			if (is.number(mapping)) {
				assert.argumentIsValid(mapping, 'mapping', is.integer, 'must be an integer');
			}

			this._code = code;
			this._description = description;

			this._mapping = mapping || null;

			const c = this.constructor;

			if (!types.has(c)) {
				types.set(c, [ ]);
			}

			const valid = Enum.fromCode(c, this._code) === null && (this._mapping === null || Enum.fromMapping(c, this._mapping) === null);

			if (valid) {
				types.get(c).push(this);
			}
		}

		/**
		 * The unique code.
		 *
		 * @public
		 * @returns {String}
		 */
		get code() {
			return this._code;
		}

		/**
		 * The description.
		 *
		 * @public
		 * @returns {String}
		 */
		get description() {
			return this._description;
		}

		/**
		 * An alternate key value (used when external systems identify enumeration items
		 * using numeric values). This value will not be present for all enumerations.
		 *
		 * @public
		 * @returns {Number|null}
		 */
		get mapping() {
			return this._mapping;
		}

		/**
		 * Returns true if the provided {@link Enum} argument is equal
		 * to the instance.
		 *
		 * @public
		 * @param {Enum} other
		 * @returns {boolean}
		 */
		equals(other) {
			return other === this || (other instanceof Enum && other.constructor === this.constructor && other.code === this.code);
		}

		/**
		 * Returns the JSON representation.
		 *
		 * @public
		 * @returns {String}
		 */
		toJSON() {
			return this.code;
		}

		/**
		 * Looks up a enumeration item; given the enumeration type and the enumeration
		 * item's value. If no matching item can be found, a null value is returned.
		 *
		 * @public
		 * @static
		 * @param {Function} type - The enumeration type.
		 * @param {String} code - The enumeration item's code.
		 * @returns {Enum|null}
		 */
		static fromCode(type, code) {
			return Enum.getItems(type).find(x => x.code === code) || null;
		}

		/**
		 * Looks up a enumeration item; given the enumeration type and the enumeration
		 * item's value. If no matching item can be found, a null value is returned.
		 *
		 * @public
		 * @static
		 * @param {Function} type - The enumeration type.
		 * @param {String} mapping - The enumeration item's mapping value.
		 * @returns {Enum|null}
		 */
		static fromMapping(type, mapping) {
			if (mapping === null) {
				return null;
			}

			return Enum.getItems(type).find(x => x.mapping === mapping) || null;
		}

		/**
		 * Returns the enumeration's items (given an enumeration type).
		 *
		 * @public
		 * @static
		 * @param {Function} type - The enumeration to list.
		 * @returns {Array}
		 */
		static getItems(type) {
			return types.get(type) || [ ];
		}

		toString() {
			return '[Enum]';
		}
	}

	return Enum;
})();
