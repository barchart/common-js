import * as assert from '@barchart/common-js/lang/assert.js';

import CompressedBinarySerializer from './CompressedBinarySerializer.js';
import DelegateSerializer from './DelegateSerializer.js';

/**
 * Converts a string into (and back from) the compressed representation
 * used on a DynamoDB record.
 *
 * @public
 * @param {Attribute} attribute
 * @extends {DelegateSerializer}
 */
export default class CompressedStringSerializer extends DelegateSerializer {
	constructor(attribute) {
		super(new CompressedBinarySerializer(attribute), serializeBuffer, deserializeBuffer);
	}

	toString() {
		return '[CompressedStringSerializer]';
	}
}

function serializeBuffer(value) {
	assert.argumentIsRequired(value, 'value', String);

	return Buffer.from(value);
}

function deserializeBuffer(value) {
	return value.toString();
}
