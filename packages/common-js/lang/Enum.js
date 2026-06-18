import * as assert from './assert.js';
import * as is from './is.js';

const types = new Map();

/**
 * An enumeration. Must be inherited. Do not instantiate directly.
 * Also, this class uses the ES6 Map, therefore a polyfill must
 * be supplied.
 *
 * @public
 * @interface
 */
export default class Enum {
	#code;
	#description;
	#mapping;

	/**
	 * @param {string} code - The unique code of the enumeration item.
	 * @param {string} description - A description of the enumeration item.
	 * @param {number=} mapping - An alternate key value (used when external systems identify enumeration items using integer values).
	 */
	constructor(code, description, mapping) {
		assert.argumentIsRequired(code, 'code', String);
		assert.argumentIsRequired(description, 'description', String);
		assert.argumentIsOptional(mapping, 'mapping', Number);

		if (is.number(mapping)) {
			assert.argumentIsValid(mapping, 'mapping', is.integer, 'must be an integer');
		}

		this.#code = code;
		this.#description = description;

		if (is.number(mapping)) {
			this.#mapping = mapping;
		} else {
			this.#mapping = null;
		}

		const c = this.constructor;

		if (!types.has(c)) {
			types.set(c, [ ]);
		}

		const valid = Enum.fromCode(c, this.#code) === null && (this.#mapping === null || Enum.fromMapping(c, this.#mapping) === null);

		if (valid) {
			types.get(c).push(this);
		}
	}

	/**
	 * The unique code.
	 *
	 * @public
	 * @returns {string}
	 */
	get code() {
		return this.#code;
	}

	/**
	 * The description.
	 *
	 * @public
	 * @returns {string}
	 */
	get description() {
		return this.#description;
	}

	/**
	 * An alternate key value (used when external systems identify enumeration items
	 * using numeric values). This value will not be present for all enumerations.
	 *
	 * @public
	 * @returns {number|null}
	 */
	get mapping() {
		return this.#mapping;
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
	 * @returns {string}
	 */
	toJSON() {
		return this.code;
	}

	/**
	 * Looks up an enumeration item; given the enumeration type and the enumeration
	 * item's value. If no matching item can be found, a null value is returned.
	 *
	 * @public
	 * @static
	 * @param {Function} type - The enumeration type.
	 * @param {string} code - The enumeration item's code.
	 * @returns {Enum|null}
	 */
	static fromCode(type, code) {
		return Enum.getItems(type).find(x => x.code === code) || null;
	}

	/**
	 * Looks up an enumeration item; given the enumeration type and the enumeration
	 * item's value. If no matching item can be found, a null value is returned.
	 *
	 * @public
	 * @static
	 * @param {Function} type - The enumeration type.
	 * @param {number} mapping - The enumeration item's mapping value.
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

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[Enum]';
	}
}
