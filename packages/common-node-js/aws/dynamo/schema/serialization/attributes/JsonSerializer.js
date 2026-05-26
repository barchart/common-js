const assert = require('@barchart/common-js/lang/assert');

const DelegateSerializer = require('./DelegateSerializer'),
	StringSerializer = require('./StringSerializer');

module.exports = (() => {
	'use strict';

	/**
	 * Converts an object into (and back from) the representation used
	 * on a DynamoDB record using JSON strings.
	 *
	 * @public
	 * @extends {DelegateSerializer}
	 */
	class JsonSerializer extends DelegateSerializer {
		constructor() {
			super(StringSerializer.INSTANCE, serializeJson, deserializeJson);
		}

		/**
		 * A singleton.
		 *
		 * @public
		 * @static
		 * @returns {JsonSerializer}
		 */
		static get INSTANCE() {
			return instance;
		}

		toString() {
			return '[JsonSerializer]';
		}
	}

	function serializeJson(value) {
		assert.argumentIsRequired(value, 'value', Object);

		return JSON.stringify(value);
	}

	function deserializeJson(value) {
		return JSON.parse(value);
	}

	const instance = new JsonSerializer();

	return JsonSerializer;
})();