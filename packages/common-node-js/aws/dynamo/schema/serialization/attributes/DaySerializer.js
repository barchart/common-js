const assert = require('@barchart/common-js/lang/assert'),
	Day = require('@barchart/common-js/lang/Day');

const DelegateSerializer = require('./DelegateSerializer'),
	StringSerializer = require('./StringSerializer');

module.exports = (() => {
	'use strict';

	/**
	 * Converts a {@link Day} instance into (and back from) the
	 * representation used on a DynamoDB record.
	 *
	 * @public
	 * @extends {DelegateSerializer}
	 */
	class DaySerializer extends DelegateSerializer {
		constructor() {
			super(StringSerializer.INSTANCE, serializeDay, deserializeDay);
		}

		/**
		 * A singleton.
		 *
		 * @public
		 * @static
		 * @returns {DaySerializer}
		 */
		static get INSTANCE() {
			return instance;
		}

		toString() {
			return '[DaySerializer]';
		}
	}

	function serializeDay(value) {
		assert.argumentIsRequired(value, 'value', Day, 'Day');

		return value.format();
	}

	function deserializeDay(value) {
		return Day.parse(value);
	}

	const instance = new DaySerializer();

	return DaySerializer;
})();