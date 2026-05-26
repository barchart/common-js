const is = require('@barchart/common-js/lang/is');

const CompressionType = require('./CompressionType'),
	DataType = require('./DataType'),
	Derivation = require('./Derivation'),
	Encryptor = require('./Encryptor');

module.exports = (() => {
	'use strict';

	/**
	 * An explicitly defined field of a DynamoDB record.
	 *
	 * @public
	 * @param {String} name
	 * @param {DataType} dataType
	 * @param {Derivation|null} derivation
	 * @param {Encryptor|null} encryptor
	 * @param {CompressionType|null} compressionType
	 */
	class Attribute {
		constructor(name, dataType, derivation, encryptor, compressionType) {
			this._name = name;
			this._dataType = dataType || null;
			this._derivation = derivation || null;
			this._encryptor = encryptor || null;
			this._compressionType = compressionType || null;
		}

		/**
		 * Name of the field.
		 *
		 * @public
		 * @returns {String}
		 */
		get name() {
			return this._name;
		}

		/**
		 * Type of the field.
		 *
		 * @public
		 * @returns {DataType}
		 */
		get dataType() {
			return this._dataType;
		}

		/**
		 * If this attribute derives its value from other attributes, then
		 * this property will return a {@link Derivation} instance; otherwise
		 * it return a null reference.
		 *
		 * @public
		 * @returns {Derivation|null}
		 */
		get derivation() {
			return this._derivation;
		}

		/**
		 * If this attribute supports encryption, then this property will return
		 * an {@link Encryptor} instance; otherwise it return a null reference.
		 *
		 * @public
		 * @returns {Encryptor|null}
		 */
		get encryptor() {
			return this._encryptor;
		}

		/**
		 * If this attribute supports compression, then this property will return
		 * an {@link CompressionType} to use; otherwise it return a null reference.
		 *
		 * @public
		 * @returns {CompressionType|null}
		 */
		get compressionType() {
			return this._compressionType;
		}

		/**
		 * Throws an {@link Error} if the instance is invalid.
		 *
		 * @public
		 */
		validate() {
			if (!is.string(this._name) || this._name.length < 1) {
				throw new Error('Attribute name is invalid.');
			}

			if (!(this._dataType instanceof DataType)) {
				throw new Error('Attribute data type is invalid.');
			}

			if (this._derivation && !(this._derivation instanceof Derivation)) {
				throw new Error('Attribute derivation must be an instance of Derivation.');
			}

			if (this._encryptor !== null) {
				if (!this._dataType.supportsEncryption) {
					throw new Error(`Attribute data type [${this._dataType}] does not support encryption.`);
				}

				if (!(this._encryptor instanceof Encryptor)) {
					throw new Error('Attribute encryptor must be an instance of Encryptor.');
				}
			}

			if (this._compressionType != null) {
				if (!this._compressionType.supportsCompression) {
					throw new Error(`Attribute data type [${this._dataType}] does not support compression.`);
				}

				if (!(this._compressionType instanceof CompressionType)) {
					throw new Error('Attribute compression type must be an instance of CompressionType.');
				}
			}
		}

		/**
		 * Generates an object which is suitable for use by the AWS SDK.
		 *
		 * @public
		 * @returns {Object}
		 */
		toAttributeSchema() {
			this.validate();

			return {
				AttributeName: this._name,
				AttributeType: this._dataType.code
			};
		}

		/**
		 * Returns true of this attribute shares the same property values
		 * as the other attribute.
		 *
		 * @public
		 * @param {Attribute} other - The attribute to compare.
		 * @param {Boolean=} relaxed - If true, the dataType is not compared.
		 * @returns {Boolean}
		 */
		equals(other, relaxed) {
			let returnVal = other instanceof Attribute;

			if (returnVal) {
				returnVal = returnVal = this._name === other.name;

				if (!(is.boolean(relaxed) && relaxed)) {
					returnVal = returnVal && this._dataType === other.dataType;
				}
			}

			return returnVal;
		}

		toString() {
			return `[Attribute (name=${this._name})]`;
		}
	}

	return Attribute;
})();