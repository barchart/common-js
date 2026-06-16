import * as assert from '@barchart/common-js/lang/assert.js';

import AttributeSerializer from './AttributeSerializer.js';
import DataType from './../../definitions/DataType.js';

/**
 * Converts a boolean into (and back from) the representation used
 * on a DynamoDB record.
 *
 * @public
 * @extends {AttributeSerializer}
 */
export default class BooleanSerializer extends AttributeSerializer {
	constructor() {
		super();
	}

	serialize(value) {
		assert.argumentIsRequired(value, 'value', Boolean);

		const wrapper = { };

		wrapper[DataType.BOOLEAN.code] = value;

		return wrapper;
	}

	deserialize(wrapper) {
		return wrapper[DataType.BOOLEAN.code];
	}

	/**
	 * A singleton.
	 *
	 * @public
	 * @static
	 * @returns {BooleanSerializer}
	 */
	static get INSTANCE() {
		return instance;
	}

	toString() {
		return '[BooleanSerializer]';
	}
}

const instance = new BooleanSerializer();
