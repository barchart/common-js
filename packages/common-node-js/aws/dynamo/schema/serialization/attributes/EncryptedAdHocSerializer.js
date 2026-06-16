import CompressedAdHocSerializer from './CompressedAdHocSerializer.js';

/**
 * Converts an {@link AdHoc} instance into (and back from) the compressed
 * and encrypted representation used on a DynamoDB record.
 *
 * @public
 * @extends {CompressedAdHocSerializer}
 */
export default class EncryptedAdHocSerializer extends CompressedAdHocSerializer {
	constructor(attribute) {
		super(attribute);
	}

	toString() {
		return '[EncryptedAdHocSerializer]';
	}
}
