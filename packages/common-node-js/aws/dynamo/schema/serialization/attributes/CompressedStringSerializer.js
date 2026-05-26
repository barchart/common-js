const assert = require('@barchart/common-js/lang/assert');

const CompressedBinarySerializer = require('./CompressedBinarySerializer'),
	DelegateSerializer = require('./DelegateSerializer');

module.exports = (() => {
	'use strict';

	/**
	 * Converts a string into (and back from) the compressed representation
	 * used on a DynamoDB record.
	 *
	 * @public
	 * @param {Attribute} attribute
	 * @extends {DelegateSerializer}
	 */
	class CompressedStringSerializer extends DelegateSerializer {
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

	return CompressedStringSerializer;
})();