const assert = require('./assert');

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
	 * @param {String} - The unique code of the enumeration item.
	 * @param {Description} - A description of the enumeration item.
	 */
	class Enum {
		constructor(code, description) {
			assert.argumentIsRequired(code, 'code', String);
			assert.argumentIsRequired(description, 'description', String);

			this._code = code;
			this._description = description;

			const c = this.constructor;

			if (!types.has(c)) {
				types.set(c, [ ]);
			}

			const existing = Enum.fromCode(c, code);

			if (existing === null) {
				types.get(c).push(this);
			}
		}

		/**
		 * The unique code.
		 */
		get code() {
			return this._code;
		}

		/**
		 * The description.
		 *
		 * @returns {*}
		 */
		get description() {
			return this._description;
		}

		/**
		 * Returns true if the provided {@link Enum} instance equals
		 *
		 * @param {Enum} other
		 * @returns {boolean}
		 */
		equals(other) {
			return other === this || (other instanceof Enum && other.constructor === this.constructor && other.code === this.code);
		}

		/**
		 * Looks up a enumeration item; given the enumeration type and the enumeration
		 * item's value. If no matching item can be found, a null value is returned.
		 *
		 * @param {Function} type - The enumeration type.
		 * @param {String} code - The enumeration item's code.
		 * @returns {Enum|null}
		 */
		static fromCode(type, code) {
			return types.get(type).find(x => x.code === code) || null;
		}

		toString() {
			return '[Enum]';
		}
	}

	return Enum;
})();
