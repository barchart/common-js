import Enum from '@barchart/common-js/lang/Enum.js';

/**
 * Defines an encryption algorithm that can be used to encrypt data.
 *
 * @public
 * @extends {Enum}
 */
export default class EncryptionType extends Enum {
	#initializationVectorLength;
	#keyLength;

	/**
	 * @param {string} code - The code.
	 * @param {number} keyLength - The key length.
	 * @param {number} initializationVectorLength - The initialization vector length.
	 */
	constructor(code, keyLength, initializationVectorLength) {
		super(code, code);

		this.#keyLength = keyLength;
		this.#initializationVectorLength = initializationVectorLength;
	}

	/**
	 * The byte length of the algorithm's key.
	 *
	 * @public
	 * @returns {number}
	 */
	get keyLength() {
		return this.#keyLength;
	}

	/**
	 * The byte length of the algorithm's initialization vector.
	 *
	 * @public
	 * @returns {number}
	 */
	get initializationVectorLength() {
		return this.#initializationVectorLength;
	}

	/**
	 * AES-192.
	 *
	 * @public
	 * @static
	 * @returns {EncryptionType}
	 */
	static get AES_192() {
		return encryptionTypeAes192;
	}

	/**
	 * AES-256.
	 *
	 * @public
	 * @static
	 * @returns {EncryptionType}
	 */
	static get AES_256() {
		return encryptionTypeAes256;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return `[EncryptionType (code=${this.code})]`;
	}
}

const encryptionTypeAes192 = new EncryptionType('aes192', 24, 16);
const encryptionTypeAes256 = new EncryptionType('aes256', 32, 16);
