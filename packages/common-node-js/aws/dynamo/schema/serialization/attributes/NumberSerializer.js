const assert = require('@barchart/common-js/lang/assert');

const AttributeSerializer = require('./AttributeSerializer'),
	DataType = require('./../../definitions/DataType');

module.exports = (() => {
	'use strict';

	/**
	 * Converts a number into (and back from) the representation used
	 * on a DynamoDB record.
	 *
	 * @public
	 * @extends {AttributeSerializer}
	 */
	class NumberSerializer extends AttributeSerializer {
		constructor() {
			super();
		}

		serialize(value) {
			assert.argumentIsRequired(value, 'value', Number);

			const wrapper = { };

			wrapper[DataType.NUMBER.code] = value.toString();

			return wrapper;
		}

		deserialize(wrapper) {
			return parseFloat(wrapper[DataType.NUMBER.code]);
		}

		/**
		 * A singleton.
		 *
		 * @public
		 * @static
		 * @returns {NumberSerializer}
		 */
		static get INSTANCE() {
			return instance;
		}

		toString() {
			return '[NumberSerializer]';
		}
	}

	const instance = new NumberSerializer();

	return NumberSerializer;
})();