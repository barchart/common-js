import * as assert from '@barchart/common-js/lang/assert.js';
import * as is from '@barchart/common-js/lang/is.js';

import AttributeSerializer from './AttributeSerializer.js';
import BooleanSerializer from './BooleanSerializer.js';
import ListSerializer from './ListSerializer.js';
import NumberSerializer from './NumberSerializer.js';
import StringSerializer from './StringSerializer.js';
import DataType from './../../definitions/DataType.js';

/**
 * Converts a map into (and back from) the representation used
 * on a DynamoDB record.
 *
 * @public
 * @extends {AttributeSerializer}
 */
export default class MapSerializer extends AttributeSerializer {
	constructor() {
		super();
	}

	/**
	 * Serializes a value.
	 *
	 * @public
	 * @param {*} map
	 * @returns {object}
	 */
	serialize(map) {
		assert.argumentIsRequired(map, 'map', Object);

		const wrapper = { };
		const serialized = { };

		Object.keys(map).forEach((key) => {
			const dt = getSupportedDataTypes().find((sdt) => sdt.is(map[key]));

			if (!dt) {
				throw new Error(`Failed to serialize list item. Provided type for [ ${map[key]} ] is not supported.`);
			}

			serialized[key] = dt.serializer.serialize(map[key]);
		});

		wrapper[DataType.MAP.code] = serialized;

		return wrapper;
	}

	/**
	 * Deserializes a value.
	 *
	 * @public
	 * @param {*} wrapper
	 * @returns {*}
	 */
	deserialize(wrapper) {
		const deserialized = { };

		const map = wrapper[DataType.MAP.code];

		Object.keys(map).forEach((key) => {
			const dt = getSupportedDataTypes().find((sdt) => !is.undef(map[key][sdt.type.code]));

			if (!dt) {
				throw new Error(`Failed to deserialize list item. Provided type for [ ${map[key]} ] is not supported.`);
			}

			deserialized[key] = dt.serializer.deserialize(map[key]);
		});

		return deserialized;
	}

	/**
	 * Returns the instance.
	 *
	 * @public
	 * @static
	 * @returns {MapSerializer}
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
		return '[MapSerializer]';
	}
}

const instance = new MapSerializer();

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
