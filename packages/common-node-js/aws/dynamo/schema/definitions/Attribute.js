import * as is from '@barchart/common-js/lang/is.js';

import CompressionType from './CompressionType.js';
import DataType from './DataType.js';
import Derivation from './Derivation.js';
import Encryptor from './Encryptor.js';

/**
 * An explicitly defined field of a DynamoDB record.
 *
 * @public
 */
export default class Attribute {
	#compressionType;
	#dataType;
	#derivation;
	#encryptor;
	#name;

	/**
	 * @param {string} name - The name.
	 * @param {DataType=} dataType - The data type.
	 * @param {Derivation|null=} derivation - The derivation.
	 * @param {Encryptor|null=} encryptor - The encryptor.
	 * @param {CompressionType|null=} compressionType - The compression type.
	 */
	constructor(name, dataType, derivation, encryptor, compressionType) {
		this.#name = name;
		this.#dataType = dataType || null;
		this.#derivation = derivation || null;
		this.#encryptor = encryptor || null;
		this.#compressionType = compressionType || null;
	}

	/**
	 * Name of the field.
	 *
	 * @public
	 * @returns {string}
	 */
	get name() {
		return this.#name;
	}

	/**
	 * Type of the field.
	 *
	 * @public
	 * @returns {DataType}
	 */
	get dataType() {
		return this.#dataType;
	}

	/**
	 * If this attribute derives its value from other attributes, then
	 * this property will return a {@link Derivation} instance; otherwise
	 * it returns a null reference.
	 *
	 * @public
	 * @returns {Derivation|null}
	 */
	get derivation() {
		return this.#derivation;
	}

	/**
	 * If this attribute supports encryption, then this property will return
	 * an {@link Encryptor} instance; otherwise it returns a null reference.
	 *
	 * @public
	 * @returns {Encryptor|null}
	 */
	get encryptor() {
		return this.#encryptor;
	}

	/**
	 * If this attribute supports compression, then this property will return
	 * an {@link CompressionType} to use; otherwise it returns a null reference.
	 *
	 * @public
	 * @returns {CompressionType|null}
	 */
	get compressionType() {
		return this.#compressionType;
	}

	/**
	 * Throws an {@link Error} if the instance is invalid.
	 *
	 * @public
	 */
	validate() {
		if (!is.string(this.#name) || this.#name.length < 1) {
			throw new Error('Attribute name is invalid.');
		}

		if (!(this.#dataType instanceof DataType)) {
			throw new Error('Attribute data type is invalid.');
		}

		if (this.#derivation && !(this.#derivation instanceof Derivation)) {
			throw new Error('Attribute derivation must be an instance of Derivation.');
		}

		if (this.#encryptor !== null) {
			if (!this.#dataType.supportsEncryption) {
				throw new Error(`Attribute data type [${this.#dataType}] does not support encryption.`);
			}

			if (!(this.#encryptor instanceof Encryptor)) {
				throw new Error('Attribute encryptor must be an instance of Encryptor.');
			}
		}

		if (this.#compressionType != null) {
			if (!this.#dataType.supportsCompression) {
				throw new Error(`Attribute data type [${this.#dataType}] does not support compression.`);
			}

			if (!(this.#compressionType instanceof CompressionType)) {
				throw new Error('Attribute compression type must be an instance of CompressionType.');
			}
		}
	}

	/**
	 * Generates an object which is suitable for use by the AWS SDK.
	 *
	 * @public
	 * @returns {object}
	 */
	toAttributeSchema() {
		this.validate();

		return {
			AttributeName: this.#name,
			AttributeType: this.#dataType.code
		};
	}

	/**
	 * Returns true of this attribute shares the same property values
	 * as the other attribute.
	 *
	 * @public
	 * @param {Attribute} other - The attribute to compare.
	 * @param {boolean=} relaxed - If true, the dataType is not compared.
	 * @returns {boolean}
	 */
	equals(other, relaxed) {
		let returnVal = other instanceof Attribute;

		if (returnVal) {
			returnVal = returnVal = this.#name === other.name;

			if (!(is.boolean(relaxed) && relaxed)) {
				returnVal = returnVal && this.#dataType === other.dataType;
			}
		}

		return returnVal;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return `[Attribute (name=${this.#name})]`;
	}
}
