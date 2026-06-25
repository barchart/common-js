import * as assert from '@barchart/common-js/lang/assert.js';

import Enum from '@barchart/common-js/lang/Enum.js';

import DelegateSerializer from './DelegateSerializer.js';
import StringSerializer from './StringSerializer.js';

/**
 * Converts a {@link Enum} item into (and back from) the
 * representation used on a DynamoDB record.
 *
 * @public
 * @extends {DelegateSerializer}
 */
export default class EnumSerializer extends DelegateSerializer {
	/**
	 * Creates a new EnumSerializer instance.
	 *
	 * @public
	 * @param {*} EnumerationType - The enumeration type.
	 */
	constructor(EnumerationType) {
		super(StringSerializer.INSTANCE, getEnumSerializerFor(EnumerationType), getEnumDeserializerFor(EnumerationType));
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
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
