import * as assert from '@barchart/common-js/lang/assert.js';

import Decimal from '@barchart/common-js/lang/Decimal.js';

import DelegateSerializer from './DelegateSerializer.js';
import StringSerializer from './StringSerializer.js';

/**
 * Converts a {@link Decimal} into (and back from) the representation used
 * on a DynamoDB record.
 *
 * @public
 * @extends {DelegateSerializer}
 */
export default class DecimalSerializer extends DelegateSerializer {
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
