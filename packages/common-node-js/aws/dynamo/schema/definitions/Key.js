import Attribute from './Attribute.js';
import KeyType from './KeyType.js';

/**
 * The definition for a DynamoDB key (i.e. an {@link Attribute} and a {@link KeyType}.
 * Keys apply to both the {@link Table} definitions and {@link Index} definitions.
 *
 * @public
 */
export default class Key {
	#attribute;
	#keyType;

	/**
	 * @param {*} attribute
	 * @param {*} keyType
	 */
	constructor(attribute, keyType) {
		this.#attribute = attribute;
		this.#keyType = keyType;
	}

	/**
	 * The key's {@link Attribute}.
	 *
	 * @public
	 * @returns {Attribute}
	 */
	get attribute() {
		return this.#attribute;
	}

	/**
	 * The key's {@link KeyType}.
	 *
	 * @public
	 * @returns {KeyType}
	 */
	get keyType() {
		return this.#keyType;
	}

	/**
	 * Throws an {@link Error} if the instance is invalid.
	 *
	 * @public
	 */
	validate() {
		if (!(this.#attribute instanceof Attribute)) {
			throw new Error('Key attribute is invalid.');
		}

		if (!(this.#keyType instanceof KeyType)) {
			throw new Error('Key type is invalid.');
		}

		this.#attribute.validate();
	}

	/**
	 * Generates an object which is suitable for use by the AWS SDK.
	 *
	 * @public
	 * @returns {object}
	 */
	toKeySchema() {
		this.validate();

		return {
			AttributeName: this.#attribute.name,
			KeyType: this.#keyType.code
		};
	}

	/**
	 * Returns true of this key shares the same property values
	 * as the other key.
	 *
	 * @public
	 * @param {Key} other - The key to compare.
	 * @param {boolean=} relaxed - If true, the key's attribute's dataType is not compared.
	 * @returns {boolean}
	 */
	equals(other, relaxed) {
		return other === this || (other instanceof Key && this.#attribute.equals(other.attribute, relaxed) && this.#keyType === other.keyType);
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return `[Key (name=${this.#attribute.name}, type=${this.#keyType.code})]`;
	}
}
