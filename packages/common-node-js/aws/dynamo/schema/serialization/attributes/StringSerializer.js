const assert = require('@barchart/common-js/lang/assert');

const AttributeSerializer = require('./AttributeSerializer'),
	DataType = require('./../../definitions/DataType');

module.exports = (() => {
	'use strict';

	/**
	 * Converts a string into (and back from) the representation used
	 * on a DynamoDB record.
	 *
	 * @public
	 * @extends {AttributeSerializer}
	 */
	class StringSerializer extends AttributeSerializer {
		constructor() {
			super();
		}

		serialize(value) {
			assert.argumentIsRequired(value, 'value', String);

			const wrapper = { };

			wrapper[DataType.STRING.code] = value;

			return wrapper;
		}

		deserialize(wrapper) {
			return wrapper[DataType.STRING.code];
		}

		/**
		 * A singleton.
		 *
		 * @public
		 * @static
		 * @returns {StringSerializer}
		 */
		static get INSTANCE() {
			return instance;
		}

		toString() {
			return '[StringSerializer]';
		}
	}

	const instance = new StringSerializer();

	return StringSerializer;
})();