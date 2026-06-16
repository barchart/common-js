import * as assert from '@barchart/common-js/lang/assert.js';
import * as is from '@barchart/common-js/lang/is.js';

import AttributeSerializer from './AttributeSerializer.js';
import BooleanSerializer from './BooleanSerializer.js';
import MapSerializer from './MapSerializer.js';
import NumberSerializer from './NumberSerializer.js';
import StringSerializer from './StringSerializer.js';
import DataType from './../../definitions/DataType.js';

/**
 * Converts a list into (and back from) the representation used
 * on a DynamoDB record.
 *
 * @public
 * @extends {AttributeSerializer}
 */
export default class ListSerializer extends AttributeSerializer {
	constructor() {
		super();
	}

	serialize(list) {
		assert.argumentIsArray(list, 'list');

		const wrapper = { };

		const serialized = list.reduce((acc, item) => {
			const dt = getSupportedDataTypes().find((sdt) => sdt.is(item));

			if (!dt) {
				throw new Error(`Failed to serialize list item. Provided type for [ ${item} ] is not supported.`);
			}

			acc.push(dt.serializer.serialize(item));

			return acc;
		}, [ ]);

		wrapper[DataType.LIST.code] = serialized;

		return wrapper;
	}

	deserialize(wrapper) {
		const deserialized = wrapper[DataType.LIST.code];

		return deserialized.reduce((acc, item) => {
			const dt = getSupportedDataTypes().find((sdt) => !is.undefined(item[sdt.type.code]));

			if (!dt) {
				throw new Error(`Failed to deserialize list item. Provided type for [ ${item} ] is not supported.`);
			}

			acc.push(dt.serializer.deserialize(item));

			return acc;
		}, [ ]);
	}

	/**
	 * A singleton.
	 *
	 * @public
	 * @static
	 * @returns {ListSerializer}
	 */
	static get INSTANCE() {
		return instance;
	}

	toString() {
		return '[ListSerializer]';
	}
}

const instance = new ListSerializer();

function getSupportedDataTypes() {
	return [
		{
			type: DataType.BOOLEAN,
			is: (value) => is.boolean(value),
			serializer: BooleanSerializer.INSTANCE,
		},
		{
			type: DataType.LIST,
			is: (value) => is.array(value),
			serializer: ListSerializer.INSTANCE,
		},
		{
			type: DataType.NUMBER,
			is: (value) => is.number(value),
			serializer: NumberSerializer.INSTANCE,
		},
		{
			type: DataType.STRING,
			is: (value) => is.string(value),
			serializer: StringSerializer.INSTANCE,
		},
		{
			type: DataType.MAP,
			is: (value) => is.object(value) && !is.array(value),
			serializer: MapSerializer.INSTANCE,
		}
	];
}
