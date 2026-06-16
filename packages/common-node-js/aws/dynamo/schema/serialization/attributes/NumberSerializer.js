import * as assert from '@barchart/common-js/lang/assert.js';

import AttributeSerializer from './AttributeSerializer.js';
import DataType from './../../definitions/DataType.js';

/**
 * Converts a number into (and back from) the representation used
 * on a DynamoDB record.
 *
 * @public
 * @extends {AttributeSerializer}
 */
export default class NumberSerializer extends AttributeSerializer {
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
