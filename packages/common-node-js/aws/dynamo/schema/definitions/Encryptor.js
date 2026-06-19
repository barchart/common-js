import * as is from '@barchart/common-js/lang/is.js';

import EncryptionType from './EncryptionType.js';

/**
 * The definition an encryption scheme to use for data at rest.
 *
 * @public
 */
export default class Encryptor {
	#key;
	#type;

	/**
	 * @param {EncryptionType=} type
	 * @param {string=} key
	 */
	constructor(type, key) {
		this.#type = type || null;
		this.#key = key;
	}

	/**
	 * The algorithm type.
	 *
	 * @public
	 * @returns {EncryptionType|null}
	 */
	get type() {
		return this.#type;
	}

	/**
	 * The key.
	 *
	 * @public
	 * @returns {string|undefined}
	 */
	get key() {
		return this.#key;
	}

	/**
	 * Throws an {@link Error} if the instance is invalid.
	 *
	 * @public
	 */
	validate() {
		if (!(this.#type instanceof EncryptionType)) {
			throw new Error('Encryption type is invalid.');
		}

		if (!(is.string(this.#key)) || this.#key.length === 0) {
			throw new Error('Password is invalid.');
		}
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return `[Encryptor]`;
	}
}
