import * as assert from '@barchart/common-js/lang/assert.js';

import CompressedBinarySerializer from './CompressedBinarySerializer.js';
import DelegateSerializer from './DelegateSerializer.js';

/**
 * @typedef {import('../../definitions/Attribute.js').default} Attribute
 */

/**
 * Converts a string into (and back from) the compressed representation
 * used on a DynamoDB record.
 *
 * @public
 * @extends {DelegateSerializer}
 */
export default class CompressedStringSerializer extends DelegateSerializer {
	/**
	 * @param {Attribute} attribute - The attribute.
	 */
	constructor(attribute) {
		super(new CompressedBinarySerializer(attribute), serializeBuffer, deserializeBuffer);
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
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
