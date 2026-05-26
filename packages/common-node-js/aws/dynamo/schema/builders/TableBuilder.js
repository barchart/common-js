const assert = require('@barchart/common-js/lang/assert'),
	Enum = require('@barchart/common-js/lang/Enum'),
	is = require('@barchart/common-js/lang/is');

const DataType = require('./../definitions/DataType'),
	ComponentType = require('./../definitions/ComponentType'),
	IndexType = require('./../definitions/IndexType'),
	KeyType = require('./../definitions/KeyType'),
	ProjectionType = require('./../definitions/ProjectionType'),
	ProvisionedThroughput = require('./../definitions/ProvisionedThroughput'),
	StreamViewType = require('./../definitions/StreamViewType'),
	Table = require('./../definitions/Table');

const AttributeBuilder = require('./AttributeBuilder'),
	ComponentBuilder = require('./ComponentBuilder'),
	IndexBuilder = require('./IndexBuilder'),
	KeyBuilder = require('./KeyBuilder'),
	ProvisionedThroughputBuilder = require('./ProvisionedThroughputBuilder');

const LambdaStage = require('../../../lambda/LambdaStage');

module.exports = (() => {
	'use strict';

	/**
	 * Fluent interface for building a {@link Table}.
	 *
	 * @public
	 * @param {String} name - Name of the table.
	 */
	class TableBuilder {
		constructor(name) {
			assert.argumentIsRequired(name, 'name', String);

			this._table = new Table(name, [ ], [ ], [ ], [ ], null, null, null);
		}

		/**
		 * The {@link Table}, given all the information provided thus far.
		 *
		 * @public
		 * @returns {Table}
		 */
		get table() {
			return this._table;
		}

		/**
		 * Adds a logic for specific environment (via a callback that fires
		 * if the current configuration applies to the desired environment).
		 *
		 * @public
		 * @param {LambdaStage} stage
		 * @param {TableBuilder~stageCallback} callback
		 * @return {TableBuilder}
		 */
		forStage(stage, callback) {
			assert.argumentIsRequired(stage, 'stage', LambdaStage, 'LambdaStage');
			assert.argumentIsRequired(callback, 'callback', Function);

			if (LambdaStage.getStageFromName(this._table.name) === stage) {
				callback(this);
			}

			return this;
		}

		/**
		 * Adds an {@link Attribute} and returns the current instance.
		 *
		 * @public
		 * @param {String} attributeName
		 * @param {DataType} dataType
		 * @param {KeyType=} keyType
		 * @returns {TableBuilder}
		 */
		withAttribute(attributeName, dataType, keyType) {
			this.withAttributeBuilder(attributeName, ab => ab.withDataType(dataType));

			if (keyType) {
				this.withKey(attributeName, keyType);
			}

			return this;
		}

		/**
		 * Adds an {@link Attribute} to the table, using a callback that
		 * provides the consumer with an {@link AttributeBuilder}, then returns
		 * the current instance.
		 *
		 * @public
		 * @param {String} attributeName
		 * @param {TableBuilder~attributeBuilderCallback} callback - Synchronously called, providing a {@link AttributeBuilder} tied to the current instance.
		 * @returns {TableBuilder}
		 */
		withAttributeBuilder(attributeName, callback) {
			assert.argumentIsRequired(callback, 'callback', Function);

			const attributeBuilder = new AttributeBuilder(attributeName, this);

			callback(attributeBuilder);

			const attribute = attributeBuilder.attribute;
			const attributes = this._table.attributes.filter(a => a.name !== attribute.name).concat(attribute);

			this._table = new Table(this._table.name, this._table.keys, this._table.indices, attributes, this._table.components, this._table.provisionedThroughput, this._table.streamViewType, this._table.ttlAttribute);

			return this;
		}

		/**
		 * Adds a {@link Component} and returns the current instance.
		 *
		 * @public
		 * @param {String} componentName
		 * @param {ComponentType} componentType
		 * @returns {TableBuilder}
		 */
		withComponent(componentName, componentType) {
			return this.withComponentBuilder(componentName, cb => cb.withComponentType(componentType));
		}

		/**
		 * Adds a {@link Component} to the table, using a callback that
		 * provides the consumer with a {@link ComponentBuilder}, then returns
		 * the current instance.
		 *
		 * @public
		 * @param {String} componentName
		 * @param {TableBuilder~componentBuilderCallback} callback - Synchronously called, providing a {@link ComponentBuilder} tied to the current instance.
		 * @returns {TableBuilder}
		 */
		withComponentBuilder(componentName, callback) {
			assert.argumentIsRequired(callback, 'callback', Function);

			const componentBuilder = new ComponentBuilder(componentName, this);

			callback(componentBuilder);

			const component = componentBuilder.component;
			const components = this._table.components.filter(c => c.name !== component.name).concat(component);

			this._table = new Table(this._table.name, this._table.keys, this._table.indices, this._table.attributes, components, this._table.provisionedThroughput, this._table.streamViewType, this._table.ttlAttribute);

			return this;
		}

		/**
		 * Adds a {@link Key} and returns the current instance.
		 *
		 * @public
		 * @param {String} keyName
		 * @param {KeyType} keyType
		 * @returns {TableBuilder}
		 */
		withKey(keyName, keyType) {
			return this.withKeyBuilder(keyName, kb => kb.withKeyType(keyType));
		}

		/**
		 * Adds a {@link Key} to the table, using a callback that
		 * provides the consumer with a {@link KeyBuilder}, then returns
		 * the current instance.
		 *
		 * @public
		 * @param {String} keyName
		 * @param {Function} callback - Synchronously called, providing a {@link KeyBuilder} tied to the current instance.
		 * @returns {TableBuilder}
		 */
		withKeyBuilder(keyName, callback) {
			assert.argumentIsRequired(callback, 'callback', Function);

			const keyBuilder = new KeyBuilder(keyName, this);

			callback(keyBuilder);

			const key = keyBuilder.key;
			const keys = this._table.keys.filter(k => k.attribute.name !== key.attribute.name).concat(key);

			this._table = new Table(this._table.name, keys, this._table.indices, this._table.attributes, this._table.components, this._table.provisionedThroughput, this._table.streamViewType, this._table.ttlAttribute);

			return this;
		}

		/**
		 * Adds an {@link Index} to the table, using a callback that
		 * provides the consumer with an {@link IndexBuilder}, then returns
		 * the current instance.
		 *
		 * @public
		 * @param {String} indexName
		 * @param {Function} callback - Synchronously called, providing a {@link IndexBuilder} tied to the current instance.
		 * @returns {TableBuilder}
		 */
		withIndexBuilder(indexName, callback) {
			assert.argumentIsRequired(callback, 'callback', Function);

			const indexBuilder = new IndexBuilder(indexName, this);

			callback(indexBuilder);

			const index = indexBuilder.index;
			const indices = this._table._indices.filter(i => i.name !== index.name).concat(index);

			this._table = new Table(this._table.name, this._table.keys, indices, this._table.attributes, this._table.components, this._table.provisionedThroughput, this._table.streamViewType, this._table.ttlAttribute);

			return this;
		}

		/**
		 * Adds a {@link ProvisionedThroughput} specification and returns the
		 * current instance.
		 *
		 * @public
		 * @param {Number} readUnits
		 * @param {Number} writeUnits
		 * @returns {TableBuilder}
		 */
		withProvisionedThroughput(readUnits, writeUnits) {
			return this.withProvisionedThroughputBuilder(ptb => ptb.withRead(readUnits).withWrite(writeUnits));
		}

		/**
		 * Adds an {@link ProvisionedThroughput} specification to the
		 * table, using a callback that provides the consumer with a
		 * {@link ProvisionedThroughputBuilder}, then returns the current instance.
		 *
		 * @public
		 * @param {Function} callback - Synchronously called, providing a {@link ProvisionedThroughputBuilder} tied to the current instance.
		 * @returns {TableBuilder}
		 */
		withProvisionedThroughputBuilder(callback) {
			assert.argumentIsRequired(callback, 'callback', Function);

			const provisionedThroughputBuilder = new ProvisionedThroughputBuilder();

			callback(provisionedThroughputBuilder);

			this._table = new Table(this._table.name, this._table.keys, this._table.indices, this._table.attributes, this._table.components, provisionedThroughputBuilder.provisionedThroughput, this._table.streamViewType, this._table.ttlAttribute);

			return this;
		}

		/**
		 * Indicates the table should use on-demand throughput (i.e. pricing), instead of
		 * provisioned throughput.
		 *
		 * @public
		 * @returns {TableBuilder}
		 */
		withOnDemandThroughput() {
			this._table = new Table(this._table.name, this._table.keys, this._table.indices, this._table.attributes, this._table.components, null, this._table.streamViewType, this._table.ttlAttribute);

			return this;
		}

		/**
		 * Defines a streaming behavior for the table.
		 *
		 * @public
		 * @param {StreamViewType} streamViewType
		 */
		withStreamViewType(streamViewType) {
			assert.argumentIsRequired(streamViewType, 'streamViewType', StreamViewType, 'StreamViewType');

			this._table = new Table(this._table.name, this._table.keys, this._table.indices, this._table.attributes, this._table.components, this._table.provisionedThroughput, streamViewType, this._table.ttlAttribute);

			return this;
		}

		/**
		 * Defines field that stores expiration time.
		 *
		 * @public
		 * @param {String} attributeName
		 * @returns {TableBuilder}
		 */
		withTimeToLive(attributeName) {
			assert.argumentIsRequired(attributeName, 'attributeName', String);

			this._table = new Table(this._table.name, this._table.keys, this._table.indices, this._table.attributes, this._table.components, this._table.provisionedThroughput, this._table.streamViewType, attributeName);

			return this;
		}

		/**
		 * Creates a new {@link TableBuilder}.
		 *
		 * @public
		 * @static
		 * @param {String} name - Name of the table.
		 * @returns {TableBuilder}
		 */
		static withName(name) {
			return new TableBuilder(name);
		}

		static fromDefinition(definition) {
			let tableBuilder = TableBuilder.withName(definition.TableName);

			if (definition.ProvisionedThroughput) {
				tableBuilder.withProvisionedThroughput(definition.ProvisionedThroughput.ReadCapacityUnits, definition.ProvisionedThroughput.WriteCapacityUnits);
			}

			definition.AttributeDefinitions.reduce((tb, ad) => tb.withAttribute(ad.AttributeName, DataType.fromCode(ad.AttributeType)), tableBuilder);
			definition.KeySchema.reduce((tb, ks) => tb.withKey(ks.AttributeName, Enum.fromCode(KeyType, ks.KeyType)), tableBuilder);

			const processIndex = (indexType, indexDefinition) => {
				return tableBuilder.withIndexBuilder(indexDefinition.IndexName, (indexBuilder) => {
					indexDefinition.KeySchema.reduce((ib, ks) => ib.withKey(ks.AttributeName, Enum.fromCode(KeyType, ks.KeyType)), indexBuilder);

					indexBuilder.withType(indexType)
						.withProjectionBuilder(Enum.fromCode(ProjectionType, indexDefinition.Projection.ProjectionType), (projectionBuilder) => {
							if (is.array(indexDefinition.Projection.NonKeyAttributes)) {
								indexDefinition.Projection.NonKeyAttributes.reduce((pb, nka) => pb.withAttribute(nka, true), projectionBuilder);
							}
						});
				});
			};

			if (is.array(definition.LocalSecondaryIndexes)) {
				definition.LocalSecondaryIndexes.reduce((tb, lsi) => processIndex(IndexType.LOCAL_SECONDARY, lsi), tableBuilder);
			}

			if (is.array(definition.GlobalSecondaryIndexes)) {
				definition.GlobalSecondaryIndexes.reduce((tb, gsi) => processIndex(IndexType.GLOBAL_SECONDARY, gsi), tableBuilder);
			}

			if (is.object(definition.StreamSpecification) && is.boolean(definition.StreamSpecification.StreamEnabled) && definition.StreamSpecification.StreamEnabled) {
				tableBuilder.withStreamViewType(Enum.fromCode(StreamViewType, definition.StreamSpecification.StreamViewType));
			}

			if (is.object(definition.TimeToLiveDescription) && ['ENABLED', 'ENABLING'].includes(definition.TimeToLiveDescription.TimeToLiveStatus)) {
				tableBuilder.withTimeToLive(definition.TimeToLiveDescription.AttributeName);
			}

			return tableBuilder.table;
		}

		toString() {
			return '[TableBuilder]';
		}
	}

	/**
	 * A callback that provides the consumer with an {@link AttributeBuilder}
	 *
	 * @public
	 * @callback TableBuilder~attributeBuilderCallback
	 * @param {AttributeBuilder} attributeBuilder
	 */

	/**
	 * A callback that provides the consumer with a {@link ComponentBuilder}
	 *
	 * @public
	 * @callback TableBuilder~componentBuilderCallback
	 * @param {AttributeBuilder} attributeBuilder
	 */

	/**
	 * A callback that provides the consumer with a {@link TableBuilder} -- assuming
	 * the configuration applies to the correct environment (i.e. {@link LambdaStage}).
	 *
	 * @public
	 * @callback TableBuilder~stageCallback
	 * @param {TableBuilder} tableBuilder
	 */

	return TableBuilder;
})();
