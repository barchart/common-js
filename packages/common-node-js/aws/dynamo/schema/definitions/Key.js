const Attribute = require('./Attribute'),
	KeyType = require('./KeyType');

module.exports = (() => {
	'use strict';

	/**
	 * The definition for a DynamoDB key (i.e. an {@link Attribute} and a {@link KeyType}.
	 * Keys apply to both the {@link Table} definitions and {@link Index} definitions.
	 *
	 * @public
	 */
	class Key {
		constructor(attribute, keyType) {
			this._attribute = attribute;
			this._keyType = keyType;
		}

		/**
		 * The key's {@link Attribute}.
		 *
		 * @public
		 * @returns {Attribute}
		 */
		get attribute() {
			return this._attribute;
		}

		/**
		 * The key's {@link KeyType}.
		 *
		 * @public
		 * @returns {KeyType}
		 */
		get keyType() {
			return this._keyType;
		}

		/**
		 * Throws an {@link Error} if the instance is invalid.
		 *
		 * @public
		 */
		validate() {
			if (!(this._attribute instanceof Attribute)) {
				throw new Error('Key attribute is invalid.');
			}

			if (!(this._keyType instanceof KeyType)) {
				throw new Error('Key type is invalid.');
			}

			this._attribute.validate();
		}

		/**
		 * Generates an object which is suitable for use by the AWS SDK.
		 *
		 * @public
		 * @returns {Object}
		 */
		toKeySchema() {
			this.validate();

			return {
				AttributeName: this._attribute.name,
				KeyType: this._keyType.code
			};
		}

		/**
		 * Returns true of this key shares the same property values
		 * as the other key.
		 *
		 * @public
		 * @param {Key} other - The key to compare.
		 * @param {Boolean=} relaxed - If true, the key's attribute's dataType is not compared.
		 * @returns {Boolean}
		 */
		equals(other, relaxed) {
			return other === this || (other instanceof Key && this._attribute.equals(other.attribute, relaxed) && this._keyType === other.keyType);
		}

		toString() {
			return `[Key (name=${this._attribute.name}, type=${this._keyType.code})]`;
		}
	}

	return Key;
})();