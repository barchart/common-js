const assert = require('@barchart/common-js/lang/assert');

const Attribute = require('./../../definitions/Attribute'),
	CompressionType = require('./../../definitions/CompressionType');

const BinarySerializer = require('./BinarySerializer');

module.exports = (() => {
	'use strict';

	/**
	 * Converts a buffer into (and back from) the representation used
	 * on a DynamoDB record, using compression.
	 *
	 * @public
	 * @param {Attribute} attribute
	 * @extends {AttributeSerializer}
	 */
	class CompressedBinarySerializer extends BinarySerializer {
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

	return CompressedBinarySerializer;
})();