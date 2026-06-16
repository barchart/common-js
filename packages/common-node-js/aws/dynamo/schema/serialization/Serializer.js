import * as assert from '@barchart/common-js/lang/assert.js';
import * as is from '@barchart/common-js/lang/is.js';

import Table from './../../schema/definitions/Table.js';
import AttributeDeserializationWriter from './writers/AttributeDeserializationWriter.js';
import AttributeSerializationWriter from './writers/AttributeSerializationWriter.js';
import ComponentDeserializationWriter from './writers/ComponentDeserializationWriter.js';
import ComponentSerializationWriter from './writers/ComponentSerializationWriter.js';
import CompositeWriter from './writers/CompositeWriter.js';

/**
 * Utilities for converting objects to (and from) a DynamoDB representation (no
 * instance-level functionality exists -- static functions only).
 *
 * @public
 */
export default class Serializer {
	constructor() {

	}

	/**
	 * Converts a simple object into one suitable for use with the
	 * AWS SDK for DynamoDB. This operation is the inverse of
	 * {@link Serializer.deserialize}.
	 *
	 * @public
	 * @param {Object} item - The object to serialize (for DynamoDB).
	 * @param {Table} table - The schema that controls serialization of the object.
	 * @param {Boolean=} keysOnly - If true, only the item's key fields will be serialized.
	 * @param {Boolean=} explicit - If true, derived properties will not be evaluated.
	 * @returns {Object} - The serialized object.
	 */
	static serialize(item, table, keysOnly, explicit) {
		assert.argumentIsRequired(item, 'item', Object);
		assert.argumentIsRequired(table, 'table', Table, 'Table');

		let serialized = getSerializationWriter(table, explicit).write(item, { });

		if (is.boolean(keysOnly) && keysOnly) {
			serialized = table.keys.reduce((accumulator, key) => {
				const name = key.attribute.name;
				const value = serialized[name];

				accumulator[name] = value;

				return accumulator;
			}, { });
		}

		return serialized;
	}

	/**
	 * Converts a DynamoDB object into a simple JavaScript object. This
	 * operation is the inverse of {@link Serializer.serialize}.
	 *
	 * @public
	 * @param {Object} item - The DynamoDB formatted object to deserialize.
	 * @param {Table} table - The schema that controls serialization of the object.
	 * @returns {Object} - The deserialized object.
	 */
	static deserialize(item, table) {
		assert.argumentIsRequired(item, 'item', Object);
		assert.argumentIsRequired(table, 'table', Table, 'Table');

		return getDeserializationWriter(table).write(item, { });
	}

	toString() {
		return '[Serializer]';
	}
}

const serializersExplicit = new Map();
const serializersNormal = new Map();

function getSerializationWriter(table, explicit) {
	let map;

	if (is.boolean(explicit) && explicit) {
		map = serializersExplicit;
	} else {
		map = serializersNormal;
	}

	if (!map.has(table)) {
		const attributeWriters = table.attributes.map(a => new AttributeSerializationWriter(a, explicit));
		const componentWriters = table.components.map(c => new ComponentSerializationWriter(c));

		map.set(table, new CompositeWriter(attributeWriters.concat(componentWriters)));
	}

	return map.get(table);
}

const deserializers = new Map();

function getDeserializationWriter(table) {
	if (!deserializers.has(table.name)) {
		const attributeWriters = table.attributes.map(a => new AttributeDeserializationWriter(a));
		const componentWriters = table.components.map(c => new ComponentDeserializationWriter(c));

		deserializers.set(table.name, new CompositeWriter(attributeWriters.concat(componentWriters)));
	}

	return deserializers.get(table.name);
}
