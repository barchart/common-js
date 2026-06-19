import CompressedStringSerializer from './CompressedStringSerializer.js';

/**
 * Converts a string into (and back from) the compressed and encrypted
 * representation used on a DynamoDB record.
 *
 * @public
 * @extends {CompressedStringSerializer}
 */
export default class EncryptedStringSerializer extends CompressedStringSerializer {
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
		return '[EncryptedStringSerializer]';
	}
}
