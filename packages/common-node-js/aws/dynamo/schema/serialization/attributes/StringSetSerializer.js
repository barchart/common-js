import * as array from '@barchart/common-js/lang/array.js';
import * as assert from '@barchart/common-js/lang/assert.js';

import AttributeSerializer from './AttributeSerializer.js';
import DataType from './../../definitions/DataType.js';

/**
 * Converts a string set into (and back from) the representation used
 * on a DynamoDB record.
 *
 * @public
 * @extends {AttributeSerializer}
 */
export default class StringSetSerializer extends AttributeSerializer {
	constructor() {
		super();
	}

	/**
	 * Serializes a value.
	 *
	 * @public
	 * @param {object[]} items
	 * @returns {object}
	 */
	serialize(items) {
		assert.argumentIsArray(items, 'items', String);

		if (items.length !== array.unique(items).length) {
			throw new Error('Could not serialize set of strings. Items must be unique.');
		}

		const wrapper = { };

		wrapper[DataType.STRING_SET.code] = items;

		return wrapper;
	}

	/**
	 * Deserializes a value.
	 *
	 * @public
	 * @param {*} wrapper
	 * @returns {*}
	 */
	deserialize(wrapper) {
		return wrapper[DataType.STRING_SET.code];
	}

	/**
	 * A singleton.
	 *
	 * @public
	 * @static
	 * @returns {StringSetSerializer}
	 */
	static get INSTANCE() {
		return instance;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[StringSetSerializer]';
	}
}

const instance = new StringSetSerializer();
