const array = require('@barchart/common-js/lang/array'),
	assert = require('@barchart/common-js/lang/assert');

const AttributeSerializer = require('./AttributeSerializer'),
	DataType = require('./../../definitions/DataType');

module.exports = (() => {
	'use strict';

	/**
	 * Converts a string set into (and back from) the representation used
	 * on a DynamoDB record.
	 *
	 * @public
	 * @extends {AttributeSerializer}
	 */
	class StringSetSerializer extends AttributeSerializer {
		constructor() {
			super();
		}

		serialize(items) {
			assert.argumentIsArray(items, 'items', String);

			if (items.length !== array.unique(items).length) {
				throw new Error('Could not serialize set of strings. Items must be unique.');
			}

			const wrapper = { };

			wrapper[DataType.STRING_SET.code] = items;

			return wrapper;
		}

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

		toString() {
			return '[StringSetSerializer]';
		}
	}

	const instance = new StringSetSerializer();

	return StringSetSerializer;
})();
