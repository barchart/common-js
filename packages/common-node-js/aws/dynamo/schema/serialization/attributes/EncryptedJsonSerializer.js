import CompressedJsonSerializer from './CompressedJsonSerializer.js';

/**
 * Converts an object into (and back from) the compressed and encrypted
 * representation used on a DynamoDB record.
 *
 * @public
 * @extends {CompressedJsonSerializer}
 */
export default class EncryptedJsonSerializer extends CompressedJsonSerializer {
	constructor(attribute) {
		super(attribute);
	}

	toString() {
		return '[EncryptedJsonSerializer]';
	}
}
