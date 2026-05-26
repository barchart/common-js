const Enum = require('@barchart/common-js/lang/Enum');

module.exports = (() => {
	'use strict';

	/**
	 * Defines an encryption algorithm that can be used to encrypt data.
	 *
	 * @public
	 * @extends {Enum}
	 * @param {String} code
	 * @param {Number} keyLength
	 * @param {Number} initializationVectorLength
	 */
	class EncryptionType extends Enum {
		constructor(code, keyLength, initializationVectorLength) {
			super(code, code);

			this._keyLength = keyLength;
			this._initializationVectorLength = initializationVectorLength;
		}

		/**
		 * The byte length of the algorithm's key.
		 *
		 * @public
		 * @returns {Number}
		 */
		get keyLength() {
			return this._keyLength;
		}

		/**
		 * The byte length of the algorithm's initialization vector.
		 *
		 * @public
		 * @returns {Number}
		 */
		get initializationVectorLength() {
			return this._initializationVectorLength;
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

		toString() {
			return `[EncryptionType (code=${this.code})]`;
		}
	}

	const encryptionTypeAes192 = new EncryptionType('aes192', 24, 16);
	const encryptionTypeAes256 = new EncryptionType('aes256', 32, 16);

	return EncryptionType;
})();