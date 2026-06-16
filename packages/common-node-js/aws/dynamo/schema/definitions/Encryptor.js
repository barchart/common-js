import * as is from '@barchart/common-js/lang/is.js';

import EncryptionType from './EncryptionType.js';

/**
 * The definition an encryption scheme to use for data at rest.
 *
 * @public
 * @param {EncryptionType} type
 * @param {String} key
 */
export default class Encryptor {
	constructor(type, key) {
		this._type = type || null;
		this._key = key;
	}

	/**
	 * The algorithm type.
	 *
	 * @public
	 * @returns {EncryptionType}
	 */
	get type() {
		return this._type;
	}

	/**
	 * The key.
	 *
	 * @public
	 * @returns {String}
	 */
	get key() {
		return this._key;
	}

	/**
	 * Throws an {@link Error} if the instance is invalid.
	 *
	 * @public
	 */
	validate() {
		if (!(this._type instanceof EncryptionType)) {
			throw new Error('Encryption type is invalid.');
		}

		if (!(is.string(this._password)) || this._password.length === 0) {
			throw new Error('Password is invalid.');
		}
	}

	toString() {
		return `[Encryptor]`;
	}
}
