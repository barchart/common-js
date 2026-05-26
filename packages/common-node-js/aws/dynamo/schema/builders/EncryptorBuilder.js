const assert = require('@barchart/common-js/lang/assert');

const Encryptor = require('./../definitions/Encryptor'),
	EncryptionType = require('./../definitions/EncryptionType');

module.exports = (() => {
	'use strict';

	/**
	 * Fluent interface for building an {@link Encryptor}.
	 *
	 * @public
	 */
	class EncryptorBuilder {
		constructor() {
			this._encryptor = new Encryptor();
		}

		/**
		 * The {@link Encryptor}, given all the information provided thus far.
		 *
		 * @public
		 * @returns {Encryptor}
		 */
		get encryptor() {
			return this._encryptor;
		}

		/**
		 * Sets the {@link EncryptionType} and returns the current instance.
		 *
		 * @public
		 * @param {EncryptionType} type
		 * @returns {EncryptorBuilder}
		 */
		withEncryptionType(type) {
			assert.argumentIsRequired(type, 'type', EncryptionType, 'EncryptionType');

			this._encryptor = new Encryptor(type, this._encryptor.key);

			return this;
		}

		/**
		 * Sets the encryption key and returns the current instance.
		 *
		 * @public
		 * @param {String} key
		 * @returns {EncryptorBuilder}
		 */
		withKey(key) {
			assert.argumentIsRequired(key, 'key', String);

			this._encryptor = new Encryptor(this._encryptor.type, key);

			return this;
		}

		toString() {
			return '[EncryptorBuilder]';
		}
	}

	return EncryptorBuilder;
})();