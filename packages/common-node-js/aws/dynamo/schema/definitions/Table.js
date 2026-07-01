import * as array from '@barchart/common-js/lang/array.js';
import * as is from '@barchart/common-js/lang/is.js';

import Attribute from './Attribute.js';
import Component from './Component.js';
import Key from './Key.js';
import KeyType from './KeyType.js';
import Index from './Index.js';
import IndexType from './IndexType.js';
import ProvisioningType from './ProvisioningType.js';
import StreamViewType from './StreamViewType.js';

/**
 * @typedef {import('./ProvisionedThroughput.js').default} ProvisionedThroughput
 */

/**
 * The schema for a DynamoDB table, including attributes, keys, indices, etc.
 *
 * @public
 */
export default class Table {
	#attributes;
	#components;
	#indices;
	#keys;
	#name;
	#provisionedThroughput;
	#streamViewType;
	#ttlAttribute;

	/**
	 * @param {string} name - The name.
	 * @param {*} keys - The keys.
	 * @param {*} indices - The indices.
	 * @param {*} attributes - The attributes.
	 * @param {*} components - The components.
	 * @param {*} provisionedThroughput - The provisioned throughput.
	 * @param {*} streamViewType - The stream view type.
	 * @param {*} ttlAttribute - The ttl attribute.
	 */
	constructor(name, keys, indices, attributes, components, provisionedThroughput, streamViewType, ttlAttribute) {
		this.#name = name;

		this.#keys = keys || [ ];
		this.#indices = indices || [ ];
		this.#attributes = attributes || [ ];
		this.#components = components || [ ];

		this.#provisionedThroughput = provisionedThroughput;

		this.#streamViewType = streamViewType || null;

		this.#ttlAttribute = ttlAttribute || null;
	}

	/**
	 * Name of the table.
	 *
	 * @public
	 * @returns {string}
	 */
	get name() {
		return this.#name;
	}

	/**
	 * The keys of the table.
	 *
	 * @public
	 * @returns {Array<Key>}
	 */
	get keys() {
		return [...this.#keys];
	}

	/**
	 * Returns the table's hash {@link Key}.
	 *
	 * @public
	 * @returns {Key|null}
	 */
	get hashKey() {
		return this.#keys.find(k => k.keyType === KeyType.HASH) || null;
	}

	/**
	 * Returns the table's range {@link Key}.
	 *
	 * @public
	 * @returns {Key|null}
	 */
	get rangeKey() {
		return this.#keys.find(k => k.keyType === KeyType.RANGE) || null;
	}

	/**
	 * The indices of the table.
	 *
	 * @public
	 * @returns {Array<Index>}
	 */
	get indices() {
		return [ ...this.#indices ];
	}

	/**
	 * The attributes of the table.
	 *
	 * @public
	 * @returns {Array<Attribute>}
	 */
	get attributes() {
		return [...this.#attributes];
	}

	/**
	 * The components of the table.
	 *
	 * @public
	 * @returns {Array<Component>}
	 */
	get components() {
		return [...this.#components];
	}

	/**
	 * The provisioning (payment) method for the table.
	 *
	 * @public
	 * @returns {ProvisioningType}
	 */
	get provisioningType() {
		if (this.#provisionedThroughput === null) {
			return ProvisioningType.ON_DEMAND;
		} else {
			return ProvisioningType.PROVISIONED;
		}
	}

	/**
	 * The provisioned throughput of the table
	 *
	 * @public
	 * @returns {Array<ProvisionedThroughput>}
	 */
	get provisionedThroughput() {
		return this.#provisionedThroughput;
	}

	/**
	 * The streaming behavior of the table. If this property returns
	 * null; then the table does not stream.
	 *
	 * @public
	 * @returns {StreamViewType|null}
	 */
	get streamViewType() {
		return this.#streamViewType;
	}

	/**
	 * The name of the attribute which defines time-to-live for the record.
	 *
	 * @public
	 * @returns {string|null}
	 */
	get ttlAttribute() {
		return this.#ttlAttribute;
	}

	/**
	 * Throws an {@link Error} if the instance is invalid.
	 *
	 * @public
	 */
	validate() {
		if (!is.string(this.#name) || this.#name.length < 1) {
			throw new Error('Table name is invalid.');
		}

		if (!is.array(this.#attributes)) {
			throw new Error('Table must have an array of attributes.');
		}

		if (!this.#attributes.every(a => a instanceof Attribute)) {
			throw new Error('Table attribute array can only contain Attribute instances.');
		}

		if (array.unique(this.#attributes.map(a => a.name)).length !== this.#attributes.length) {
			throw new Error('Table attribute names must be unique (only one attribute with a given name).');
		}

		if (!is.array(this.#keys)) {
			throw new Error('Table must have an array of keys.');
		}

		if (!this.#keys.every(k => k instanceof Key)) {
			throw new Error('Table key array can only contain Key instances.');
		}

		if (this.#keys.filter(k => k.keyType === KeyType.HASH).length !== 1) {
			throw new Error('Table must have one hash key.');
		}

		if (this.#keys.filter(k => k.keyType === KeyType.RANGE).length > 1) {
			throw new Error('Table must not have more than one range key.');
		}

		if (array.unique(this.#keys.map(k => k.attribute.name)).length !== this.#keys.length) {
			throw new Error('Table key names must be unique (only one key with a given name).');
		}

		if (!is.array(this.#indices)) {
			throw new Error('Table must have an array of indices.');
		}

		if (!this.#indices.every(i => i instanceof Index)) {
			throw new Error('Table indices array can only contain Index instances.');
		}

		if (array.unique(this.#indices.map(i => i.name)).length !== this.#indices.length) {
			throw new Error('Table index names must be unique (only one index with a given name).');
		}

		if (!is.array(this.#components)) {
			throw new Error('Table must have an array of components.');
		}

		if (!this.#components.every(c => c instanceof Component)) {
			throw new Error('Table component array can only contain Component instances.');
		}

		const componentNames = this.#components.reduce((names, component) => {
			return names.concat(component.componentType.definitions.map(ctd => ctd.getFieldName(component.name)));
		}, [ ]);

		if (array.intersection(this.#attributes.map(a => a.name), componentNames).length !== 0) {
			throw new Error('Component names must not conflict with attribute names.');
		}

		if (this.#streamViewType !== null && !(this.#streamViewType instanceof StreamViewType)) {
			throw new Error('Table steaming type is invalid.');
		}

		if (this.#ttlAttribute !== null && this.#attributes.filter(a => a.name === this.#ttlAttribute).length === 0) {
			throw new Error('A time-to-live attribute was specified, but it does not exist in the attribute list.');
		}

		this.#keys.forEach(k => k.validate());
		this.#indices.forEach(i => i.validate());
		this.#components.forEach(c => c.validate());

		if (this.#provisionedThroughput) {
			this.#provisionedThroughput.validate();
		}
	}

	/**
	 * Generates an object which is suitable for use by the AWS SDK.
	 *
	 * @public
	 * @returns {object}
	 */
	toTableSchema() {
		this.validate();

		const schema = {
			TableName: this.#name
		};

		schema.KeySchema = this.#keys.map(k => k.toKeySchema());

		if (this.provisioningType === ProvisioningType.PROVISIONED) {
			schema.BillingMode = ProvisioningType.PROVISIONED.key;
			schema.ProvisionedThroughput = this.#provisionedThroughput.toProvisionedThroughputSchema();
		} else {
			schema.BillingMode = ProvisioningType.ON_DEMAND.key;
		}

		const globalIndices = this.#indices.filter(i => i.type === IndexType.GLOBAL_SECONDARY);
		const localIndices = this.#indices.filter(i => i.type === IndexType.LOCAL_SECONDARY);

		if (globalIndices.length !== 0) {
			schema.GlobalSecondaryIndexes = globalIndices.map(i => i.toIndexSchema());
		}

		if (localIndices.length !== 0) {
			schema.LocalSecondaryIndexes = localIndices.map(i => i.toIndexSchema());
		}

		let keys = array.uniqueBy(array.flatten(this.#indices.map(i => i.keys)).concat([...this.#keys]), k => k.attribute.name);

		schema.AttributeDefinitions = keys.map(k => k.attribute.toAttributeSchema());

		if (this.#streamViewType) {
			schema.StreamSpecification = {
				StreamEnabled: true,
				StreamViewType: this.#streamViewType.schemaName
			};
		}

		return schema;
	}

	/**
	 * Generates an object which is suitable for use by the AWS SDK.
	 *
	 * @public
	 * @returns {object}
	 */
	toTtlSchema() {
		const schema = { };

		schema.TableName = this.#name;

		if (this.#ttlAttribute) {
			schema.TimeToLiveSpecification = {
				AttributeName: this.#ttlAttribute,
				Enabled: true
			};
		}

		return schema;
	}

	/**
	 * Returns true of the other table shares the same name, keys, indices, and
	 * attributes.
	 *
	 * @public
	 * @param {Table} other - The table to compare.
	 * @param {boolean} relaxed - If true, certain aspects of the data structures are ignored. This is because a definition received from the AWS SDK omits some information (e.g. non-key attributes, etc.).
	 */
	equals(other, relaxed) {
		if (other === this) {
			return true;
		}

		let returnVal = other instanceof Table;

		if (returnVal) {
			returnVal = returnVal && this.#name === other.name;

			returnVal = returnVal && this.#keys.length === other.keys.length;
			returnVal = returnVal && this.#keys.every(k => other.keys.some(ok => ok.equals(k, relaxed)));

			returnVal = returnVal && this.#indices.length === other.indices.length;
			returnVal = returnVal && this.#indices.every(i => other.indices.some(oi => oi.equals(i, relaxed)));

			if (!(is.boolean(relaxed) && relaxed)) {
				returnVal = returnVal && this.#ttlAttribute === other.ttlAttribute;

				returnVal = returnVal && this.#attributes.length === other.attributes.length;
				returnVal = returnVal && this.#attributes.every(a => other.attributes.some(oa => oa.equals(a, relaxed)));

				if (this.#provisionedThroughput && other.provisionedThroughput) {
					returnVal = returnVal && this.#provisionedThroughput.compareTo(other.provisionedThroughput);
				} else {
					returnVal = returnVal && this.#provisionedThroughput === other.provisionedThroughput;
				}
			}
		}

		return returnVal;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return `[Table (name=${this.#name})]`;
	}
}
