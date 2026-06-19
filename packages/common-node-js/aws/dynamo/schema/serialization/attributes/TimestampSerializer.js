import * as assert from '@barchart/common-js/lang/assert.js';

import Timestamp from '@barchart/common-js/lang/Timestamp.js';

import DelegateSerializer from './DelegateSerializer.js';
import NumberSerializer from './NumberSerializer.js';

/**
 * Converts a {@link Timestamp} instance into (and back from) the
 * representation used on a DynamoDB record.
 *
 * @public
 * @extends {DelegateSerializer}
 */
export default class TimestampSerializer extends DelegateSerializer {
	constructor() {
		super(NumberSerializer.INSTANCE, serializeTimestamp, deserializeTimestamp);
	}

	/**
	 * A singleton.
	 *
	 * @public
	 * @static
	 * @returns {TimestampSerializer}
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
		return '[TimestampSerializer]';
	}
}

function serializeTimestamp(value) {
	assert.argumentIsRequired(value, 'value', Timestamp, 'Timestamp');

	return value.timestamp;
}

function deserializeTimestamp(value) {
	return new Timestamp(value);
}

const instance = new TimestampSerializer();
