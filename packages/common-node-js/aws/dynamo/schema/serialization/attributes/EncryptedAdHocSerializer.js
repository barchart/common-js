import CompressedAdHocSerializer from './CompressedAdHocSerializer.js';

/**
 * Converts an {@link AdHoc} instance into (and back from) the compressed
 * and encrypted representation used on a DynamoDB record.
 *
 * @public
 * @extends {CompressedAdHocSerializer}
 */
export default class EncryptedAdHocSerializer extends CompressedAdHocSerializer {
	/**
	 * @param {*} attribute - The attribute.
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
		return '[EncryptedAdHocSerializer]';
	}
}
