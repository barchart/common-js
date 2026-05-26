const assert = require('@barchart/common-js/lang/assert');

const CompressedBinarySerializer = require('./CompressedBinarySerializer'),
	DelegateSerializer = require('./DelegateSerializer');

module.exports = (() => {
	'use strict';

	/**
	 * Converts an object into (and back from) the compressed representation
	 * used on a DynamoDB record.
	 *
	 * @public
	 * @param {Attribute} attribute
	 * @extends {DelegateSerializer}
	 */
	class CompressedJsonSerializer extends DelegateSerializer {
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

	return CompressedJsonSerializer;
})();