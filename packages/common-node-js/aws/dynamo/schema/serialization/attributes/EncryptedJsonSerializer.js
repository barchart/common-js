import CompressedJsonSerializer from './CompressedJsonSerializer.js';

/**
 * Converts an object into (and back from) the compressed and encrypted
 * representation used on a DynamoDB record.
 *
 * @public
 * @extends {CompressedJsonSerializer}
 */
export default class EncryptedJsonSerializer extends CompressedJsonSerializer {
	/**
	 * @param {*} attribute
	 */
	constructor(attribute) {
		super(attribute);
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[EncryptedJsonSerializer]';
	}
}
