import * as assert from '@barchart/common-js/lang/assert.js';

import DelegateSerializer from './DelegateSerializer.js';
import StringSerializer from './StringSerializer.js';

/**
 * Converts an object into (and back from) the representation used
 * on a DynamoDB record using JSON strings.
 *
 * @public
 * @extends {DelegateSerializer}
 */
export default class JsonSerializer extends DelegateSerializer {
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
