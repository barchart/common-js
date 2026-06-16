import * as assert from '@barchart/common-js/lang/assert.js';

import Day from '@barchart/common-js/lang/Day.js';

import DelegateSerializer from './DelegateSerializer.js';
import StringSerializer from './StringSerializer.js';

/**
 * Converts a {@link Day} instance into (and back from) the
 * representation used on a DynamoDB record.
 *
 * @public
 * @extends {DelegateSerializer}
 */
export default class DaySerializer extends DelegateSerializer {
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
