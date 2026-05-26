const array = require('@barchart/common-js/lang/array'),
	is = require('@barchart/common-js/lang/is');

const Attribute = require('./Attribute'),
	Component = require('./Component'),
	Key = require('./Key'),
	KeyType = require('./KeyType'),
	Index = require('./Index'),
	IndexType = require('./IndexType'),
	ProvisioningType = require('./ProvisioningType'),
	StreamViewType = require('./StreamViewType');

module.exports = (() => {
	'use strict';

	/**
	 * The schema for a DynamoDB table, including attributes, keys, indices, etc.
	 *
	 * @public
	 */
	class Table {
		constructor(name, keys, indices, attributes, components, provisionedThroughput, streamViewType, ttlAttribute) {
			this._name = name;

			this._keys = keys || [ ];
			this._indices = indices || [ ];
			this._attributes = attributes || [ ];
			this._components = components || [ ];

			this._provisionedThroughput = provisionedThroughput;

			this._streamViewType = streamViewType || null;

			this._ttlAttribute = ttlAttribute || null;
		}

		/**
		 * Name of the table.
		 *
		 * @public
		 * @returns {String}
		 */
		get name() {
			return this._name;
		}

		/**
		 * The keys of the table.
		 *
		 * @public
		 * @returns {Array<Key>}
		 */
		get keys() {
			return [...this._keys];
		}

		/**
		 * Returns the table's hash {@link Key}.
		 *
		 * @public
		 * @returns {Key|null}
		 */
		get hashKey() {
			return this._keys.find(k => k.keyType === KeyType.HASH) || null;
		}

		/**
		 * Returns the table's range {@link Key}.
		 *
		 * @public
		 * @returns {Key|null}
		 */
		get rangeKey() {
			return this._keys.find(k => k.keyType === KeyType.RANGE) || null;
		}

		/**
		 * The indices of the table.
		 *
		 * @public
		 * @returns {Array<Index>}
		 */
		get indices() {
			return [...this._indices];
		}

		/**
		 * The attributes of the table.
		 *
		 * @public
		 * @returns {Array<Attributes>}
		 */
		get attributes() {
			return [...this._attributes];
		}

		/**
		 * The components of the table.
		 *
		 * @public
		 * @returns {Array<Component>}
		 */
		get components() {
			return [...this._components];
		}

		/**
		 * The provisioning (payment) method for the table.
		 *
		 * @public
		 * @returns {ProvisioningType}
		 */
		get provisioningType() {
			if (this._provisionedThroughput === null) {
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
			return this._provisionedThroughput;
		}

		/**
		 * The streaming behavior of the table. If this property returns
		 * null; then the table does not stream.
		 *
		 * @returns {StreamViewType|null}
		 */
		get streamViewType() {
			return this._streamViewType;
		}

		/**
		 * The name of the attribute which defines time-to-live for the record.
		 *
		 * @public
		 * @returns {String|null}
		 */
		get ttlAttribute() {
			return this._ttlAttribute;
		}

		/**
		 * Throws an {@link Error} if the instance is invalid.
		 *
		 * @public
		 */
		validate() {
			if (!is.string(this._name) || this._name.length < 1) {
				throw new Error('Table name is invalid.');
			}

			if (!is.array(this._attributes)) {
				throw new Error('Table must have an array of attributes.');
			}

			if (!this._attributes.every(a => a instanceof Attribute)) {
				throw new Error('Table attribute array can only contain Attribute instances.');
			}

			if (array.unique(this._attributes.map(a => a.name)).length !== this._attributes.length) {
				throw new Error('Table attribute names must be unique (only one attribute with a given name).');
			}

			if (!is.array(this._keys)) {
				throw new Error('Table must have an array of keys.');
			}

			if (!this._keys.every(k => k instanceof Key)) {
				throw new Error('Table key array can only contain Key instances.');
			}

			if (this._keys.filter(k => k.keyType === KeyType.HASH).length !== 1) {
				throw new Error('Table must have one hash key.');
			}

			if (this._keys.filter(k => k.keyType === KeyType.RANGE).length > 1) {
				throw new Error('Table must not have more than one range key.');
			}

			if (array.unique(this._keys.map(k => k.attribute.name)).length !== this._keys.length) {
				throw new Error('Table key names must be unique (only one key with a given name).');
			}

			if (!is.array(this._indices)) {
				throw new Error('Table must have an array of indices.');
			}

			if (!this._indices.every(i => i instanceof Index)) {
				throw new Error('Table indices array can only contain Index instances.');
			}

			if (array.unique(this._indices.map(i => i.name)).length !== this._indices.length) {
				throw new Error('Table index names must be unique (only one index with a given name).');
			}

			if (!is.array(this._components)) {
				throw new Error('Table must have an array of components.');
			}

			if (!this._components.every(c => c instanceof Component)) {
				throw new Error('Table component array can only contain Component instances.');
			}

			const componentNames = this._components.reduce((names, component) => {
				return names.concat(component.componentType.definitions.map(ctd => ctd.getFieldName(component.name)));
			}, [ ]);

			if (array.intersection(this._attributes.map(a => a.name), componentNames).length !== 0) {
				throw new Error('Component names must not conflict with attribute names.');
			}

			if (this._streamViewType !== null && !(this._streamViewType instanceof StreamViewType)) {
				throw new Error('Table steaming type is invalid.');
			}

			if (this._ttlAttribute !== null && this._attributes.filter(a => a.name === this._ttlAttribute).length === 0) {
				throw new Error('A time-to-live attribute was specified, but it does not exist in the attribute list.');
			}

			this._keys.forEach(k => k.validate());
			this._indices.forEach(i => i.validate());
			this._components.forEach(c => c.validate());

			if (this._provisionedThroughput) {
				this._provisionedThroughput.validate();
			}
		}

		/**
		 * Generates an object which is suitable for use by the AWS SDK.
		 *
		 * @public
		 * @returns {Object}
		 */
		toTableSchema() {
			this.validate();

			const schema = {
				TableName: this._name
			};

			schema.KeySchema = this._keys.map(k => k.toKeySchema());

			if (this.provisioningType === ProvisioningType.PROVISIONED) {
				schema.BillingMode = ProvisioningType.PROVISIONED.key;
				schema.ProvisionedThroughput = this._provisionedThroughput.toProvisionedThroughputSchema();
			} else {
				schema.BillingMode = ProvisioningType.ON_DEMAND.key;
			}

			const globalIndices = this._indices.filter(i => i.type === IndexType.GLOBAL_SECONDARY);
			const localIndices = this._indices.filter(i => i.type === IndexType.LOCAL_SECONDARY);

			if (globalIndices.length !== 0) {
				schema.GlobalSecondaryIndexes = globalIndices.map(i => i.toIndexSchema());
			}

			if (localIndices.length !== 0) {
				schema.LocalSecondaryIndexes = localIndices.map(i => i.toIndexSchema());
			}

			let keys = array.uniqueBy(array.flatten(this._indices.map(i => i.keys)).concat([...this._keys]), k => k.attribute.name);

			schema.AttributeDefinitions = keys.map(k => k.attribute.toAttributeSchema());

			if (this._streamViewType) {
				schema.StreamSpecification = {
					StreamEnabled: true,
					StreamViewType: this._streamViewType.schemaName
				};
			}

			return schema;
		}

		/**
		 * Generates an object which is suitable for use by the AWS SDK.
		 *
		 * @public
		 * @returns {Object}
		 */
		toTtlSchema() {
			const schema = { };

			schema.TableName = this._name;

			if (this._ttlAttribute) {
				schema.TimeToLiveSpecification = {
					AttributeName: this._ttlAttribute,
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
		 * @param {Boolean} relaxed - If true, certain aspects of the data structures are ignored. This is because a definition received from the AWS SDK omits some information (e.g. non-key attributes, etc).
		 */
		equals(other, relaxed) {
			if (other === this) {
				return true;
			}

			let returnVal = other instanceof Table;

			if (returnVal) {
				returnVal = returnVal && this._name === other.name;

				returnVal = returnVal && this._keys.length === other.keys.length;
				returnVal = returnVal && this._keys.every(k => other.keys.some(ok => ok.equals(k, relaxed)));

				returnVal = returnVal && this._indices.length === other.indices.length;
				returnVal = returnVal && this._indices.every(i => other.indices.some(oi => oi.equals(i, relaxed)));

				if (!(is.boolean(relaxed) && relaxed)) {
					returnVal = returnVal && this._ttlAttribute === other.ttlAttribute;

					returnVal = returnVal && this._attributes.length === other.attributes.length;
					returnVal = returnVal && this._attributes.every(a => other.attributes.some(oa => oa.equals(a, relaxed)));

					if (this._provisionedThroughput && other.provisionedThroughput) {
						returnVal = returnVal && this._provisionedThroughput.compareTo(other.provisionedThroughput);
					} else {
						returnVal = returnVal && this._provisionedThroughput === other.provisionedThroughput;
					}
				}
			}

			return returnVal;
		}

		toString() {
			return `[Table (name=${this._name})]`;
		}
	}

	return Table;
})();
