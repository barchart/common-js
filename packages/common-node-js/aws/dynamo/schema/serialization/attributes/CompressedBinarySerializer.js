import * as assert from '@barchart/common-js/lang/assert.js';

import Attribute from './../../definitions/Attribute.js';
import CompressionType from './../../definitions/CompressionType.js';
import BinarySerializer from './BinarySerializer.js';

/**
 * Converts a buffer into (and back from) the representation used
 * on a DynamoDB record, using compression.
 *
 * @public
 * @param {Attribute} attribute
 * @extends {AttributeSerializer}
 */
export default class CompressedBinarySerializer extends BinarySerializer {
	constructor(attribute) {
		super();

		assert.argumentIsRequired(attribute, 'attribute', Attribute, 'Attribute');

		this._attribute = attribute;
	}

	_getAttribute() {
		return this._attribute;
	}

	_getCompressionType() {
		return this._getAttribute().compressionType || CompressionType.DEFLATE;
	}

	_getEncryptor() {
		return this._getAttribute().encryptor || null;
	}

	toString() {
		return '[CompressedBinarySerializer]';
	}
}
