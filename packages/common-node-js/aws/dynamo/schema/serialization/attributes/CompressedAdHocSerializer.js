const AdHoc = require('@barchart/common-js/lang/AdHoc'),
	assert = require('@barchart/common-js/lang/assert');

const CompressedBinarySerializer = require('./CompressedBinarySerializer'),
	DelegateSerializer = require('./DelegateSerializer');

module.exports = (() => {
	'use strict';

	/**
	 * Converts an {@link AdHoc} object into (and back from) the compressed
	 * representation used on a DynamoDB record.
	 *
	 * @public
	 * @param {Attribute} attribute
	 * @extends {DelegateSerializer}
	 */
	class CompressedAdHocSerializer extends DelegateSerializer {
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

	return CompressedAdHocSerializer;
})();