const assert = require('@barchart/common-js/lang/assert'),
	Enum = require('@barchart/common-js/lang/Enum');

const DelegateSerializer = require('./DelegateSerializer'),
	StringSerializer = require('./StringSerializer');

module.exports = (() => {
	'use strict';

	/**
	 * Converts a {@link Enum} item into (and back from) the
	 * representation used on a DynamoDB record.
	 *
	 * @public
	 * @extends {DelegateSerializer}
	 */
	class EnumSerializer extends DelegateSerializer {
		constructor(EnumerationType) {
			super(StringSerializer.INSTANCE, getEnumSerializerFor(EnumerationType), getEnumDeserializerFor(EnumerationType));
		}

		toString() {
			return '[EnumSerializer]';
		}
	}

	function getEnumSerializerFor(EnumerationType) {
		return (value) => {
			assert.argumentIsRequired(value, 'value', EnumerationType, 'EnumerationType');

			return value.code;
		};
	}

	function getEnumDeserializerFor(EnumerationType) {
		return (value) => {
			return Enum.fromCode(EnumerationType, value);
		};
	}

	return EnumSerializer;
})();