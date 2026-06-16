import * as assert from '@barchart/common-js/lang/assert.js';

import AdHoc from '@barchart/common-js/lang/AdHoc.js';

import CompressedBinarySerializer from './CompressedBinarySerializer.js';
import DelegateSerializer from './DelegateSerializer.js';

/**
 * Converts an {@link AdHoc} object into (and back from) the compressed
 * representation used on a DynamoDB record.
 *
 * @public
 * @param {Attribute} attribute
 * @extends {DelegateSerializer}
 */
export default class CompressedAdHocSerializer extends DelegateSerializer {
	constructor(attribute) {
		super(new CompressedBinarySerializer(attribute), serializeBuffer, deserializeBuffer);
	}

	toString() {
		return '[CompressedAdHocSerializer]';
	}
}

function serializeBuffer(value) {
	assert.argumentIsRequired(value, 'value', AdHoc, 'AdHoc');

	return Buffer.from(value.toJSON());
}

function deserializeBuffer(value) {
	return AdHoc.parse(value.toString());
}
