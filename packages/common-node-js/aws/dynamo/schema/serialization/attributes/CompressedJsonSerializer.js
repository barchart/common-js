import * as assert from '@barchart/common-js/lang/assert.js';

import CompressedBinarySerializer from './CompressedBinarySerializer.js';
import DelegateSerializer from './DelegateSerializer.js';

/**
 * Converts an object into (and back from) the compressed representation
 * used on a DynamoDB record.
 *
 * @public
 * @param {Attribute} attribute
 * @extends {DelegateSerializer}
 */
export default class CompressedJsonSerializer extends DelegateSerializer {
	constructor(attribute) {
		super(new CompressedBinarySerializer(attribute), serializeBuffer, deserializeBuffer);
	}

	toString() {
		return '[CompressedJsonSerializer]';
	}
}

function serializeBuffer(value) {
	assert.argumentIsRequired(value, 'value', Object);

	return Buffer.from(JSON.stringify(value));
}

function deserializeBuffer(value) {
	return JSON.parse(value.toString());
}
