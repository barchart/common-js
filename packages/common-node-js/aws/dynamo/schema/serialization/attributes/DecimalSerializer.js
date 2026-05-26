const assert = require('@barchart/common-js/lang/assert'),
	Decimal = require('@barchart/common-js/lang/Decimal');

const DelegateSerializer = require('./DelegateSerializer'),
	StringSerializer = require('./StringSerializer');

module.exports = (() => {
	'use strict';

	/**
	 * Converts a {@link Decimal} into (and back from) the representation used
	 * on a DynamoDB record.
	 *
	 * @public
	 * @extends {DelegateSerializer}
	 */
	class DecimalSerializer extends DelegateSerializer {
		constructor() {
			super(StringSerializer.INSTANCE, serializeDecimal, deserializeDecimal);
		}

		/**
		 * A singleton.
		 *
		 * @public
		 * @static
		 * @returns {DecimalSerializer}
		 */
		static get INSTANCE() {
			return instance;
		}

		toString() {
			return '[DecimalSerializer]';
		}
	}

	function serializeDecimal(value) {
		assert.argumentIsRequired(value, 'value', Decimal);

		return value.toFixed();
	}

	function deserializeDecimal(value) {
		return new Decimal(value);
	}

	const instance = new DecimalSerializer();

	return DecimalSerializer;
})();