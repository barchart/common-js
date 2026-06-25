import * as assert from '@barchart/common-js/lang/assert.js';

import Attribute from './../../definitions/Attribute.js';
import CompressionType from './../../definitions/CompressionType.js';
import BinarySerializer from './BinarySerializer.js';

/**
 * Converts a buffer into (and back from) the representation used
 * on a DynamoDB record, using compression.
 *
 * @public
 * @extends {BinarySerializer}
 */
export default class CompressedBinarySerializer extends BinarySerializer {
	#attribute;

	/**
	 * @param {Attribute} attribute - The attribute.
	 */
	constructor(attribute) {
		super();

		assert.argumentIsRequired(attribute, 'attribute', Attribute, 'Attribute');

		this.#attribute = attribute;
	}

	/**
	 * Returns the attribute.
	 *
	 * @protected
	 * @returns {*}
	 */
	_getAttribute() {
		return this.#attribute;
	}

	/**
	 * Returns the compression type.
	 *
	 * @protected
	 * @returns {*}
	 */
	_getCompressionType() {
		return this._getAttribute().compressionType || CompressionType.DEFLATE;
	}

	/**
	 * Returns the encryptor.
	 *
	 * @protected
	 * @returns {*}
	 */
	_getEncryptor() {
		return this._getAttribute().encryptor || null;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[CompressedBinarySerializer]';
	}
}
