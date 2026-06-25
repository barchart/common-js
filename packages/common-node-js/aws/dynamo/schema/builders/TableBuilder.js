import * as assert from '@barchart/common-js/lang/assert.js';
import * as is from '@barchart/common-js/lang/is.js';

import Enum from '@barchart/common-js/lang/Enum.js';

import DataType from './../definitions/DataType.js';
import ComponentType from './../definitions/ComponentType.js';
import IndexType from './../definitions/IndexType.js';
import KeyType from './../definitions/KeyType.js';
import ProjectionType from './../definitions/ProjectionType.js';
import ProvisionedThroughput from './../definitions/ProvisionedThroughput.js';
import StreamViewType from './../definitions/StreamViewType.js';
import Table from './../definitions/Table.js';
import AttributeBuilder from './AttributeBuilder.js';
import ComponentBuilder from './ComponentBuilder.js';
import IndexBuilder from './IndexBuilder.js';
import KeyBuilder from './KeyBuilder.js';
import ProvisionedThroughputBuilder from './ProvisionedThroughputBuilder.js';
import LambdaStage from '../../../lambda/LambdaStage.js';

/**
 * Fluent interface for building a {@link Table}.
 *
 * @public
 */
export default class TableBuilder {
	#table;

	/**
	 * @param {string} name - Name of the table.
	 */
	constructor(name) {
		assert.argumentIsRequired(name, 'name', String);

		this.#table = new Table(name, [ ], [ ], [ ], [ ], null, null, null);
	}

	/**
	 * The {@link Table}, given all the information provided thus far.
	 *
	 * @public
	 * @returns {Table}
	 */
	get table() {
		return this.#table;
	}

	/**
	 * Adds a logic for specific environment (via a callback that fires
	 * if the current configuration applies to the desired environment).
	 *
	 * @public
	 * @param {LambdaStage} stage
	 * @param {StageCallback} callback
	 * @returns {TableBuilder}
	 */
	forStage(stage, callback) {
		assert.argumentIsRequired(stage, 'stage', LambdaStage, 'LambdaStage');
		assert.argumentIsRequired(callback, 'callback', Function);

		if (LambdaStage.getStageFromName(this.#table.name) === stage) {
			callback(this);
		}

		return this;
	}

	/**
	 * Adds an {@link Attribute} and returns the current instance.
	 *
	 * @public
	 * @param {string} attributeName
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
	 * @param {string} attributeName
	 * @param {AttributeBuilderCallback} callback - Synchronously called, providing a {@link AttributeBuilder} tied to the current instance.
	 * @returns {TableBuilder}
	 */
	withAttributeBuilder(attributeName, callback) {
		assert.argumentIsRequired(callback, 'callback', Function);

		const attributeBuilder = new AttributeBuilder(attributeName, this);

		callback(attributeBuilder);

		const attribute = attributeBuilder.attribute;
		const attributes = this.#table.attributes.filter(a => a.name !== attribute.name).concat(attribute);

		this.#table = new Table(this.#table.name, this.#table.keys, this.#table.indices, attributes, this.#table.components, this.#table.provisionedThroughput, this.#table.streamViewType, this.#table.ttlAttribute);

		return this;
	}

	/**
	 * Adds a {@link Component} and returns the current instance.
	 *
	 * @public
	 * @param {string} componentName
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
	 * @param {string} componentName
	 * @param {ComponentBuilderCallback} callback - Synchronously called, providing a {@link ComponentBuilder} tied to the current instance.
	 * @returns {TableBuilder}
	 */
	withComponentBuilder(componentName, callback) {
		assert.argumentIsRequired(callback, 'callback', Function);

		const componentBuilder = new ComponentBuilder(componentName);

		callback(componentBuilder);

		const component = componentBuilder.component;
		const components = this.#table.components.filter(c => c.name !== component.name).concat(component);

		this.#table = new Table(this.#table.name, this.#table.keys, this.#table.indices, this.#table.attributes, components, this.#table.provisionedThroughput, this.#table.streamViewType, this.#table.ttlAttribute);

		return this;
	}

	/**
	 * Adds a {@link Key} and returns the current instance.
	 *
	 * @public
	 * @param {string} keyName
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
	 * @param {string} keyName
	 * @param {Function} callback - Synchronously called, providing a {@link KeyBuilder} tied to the current instance.
	 * @returns {TableBuilder}
	 */
	withKeyBuilder(keyName, callback) {
		assert.argumentIsRequired(callback, 'callback', Function);

		const keyBuilder = new KeyBuilder(keyName, this);

		callback(keyBuilder);

		const key = keyBuilder.key;
		const keys = this.#table.keys.filter(k => k.attribute.name !== key.attribute.name).concat(key);

		this.#table = new Table(this.#table.name, keys, this.#table.indices, this.#table.attributes, this.#table.components, this.#table.provisionedThroughput, this.#table.streamViewType, this.#table.ttlAttribute);

		return this;
	}

	/**
	 * Adds an {@link Index} to the table, using a callback that
	 * provides the consumer with an {@link IndexBuilder}, then returns
	 * the current instance.
	 *
	 * @public
	 * @param {string} indexName
	 * @param {Function} callback - Synchronously called, providing a {@link IndexBuilder} tied to the current instance.
	 * @returns {TableBuilder}
	 */
	withIndexBuilder(indexName, callback) {
		assert.argumentIsRequired(callback, 'callback', Function);

		const indexBuilder = new IndexBuilder(indexName, this);

		callback(indexBuilder);

		const index = indexBuilder.index;
		const indices = this.#table._indices.filter(i => i.name !== index.name).concat(index);

		this.#table = new Table(this.#table.name, this.#table.keys, indices, this.#table.attributes, this.#table.components, this.#table.provisionedThroughput, this.#table.streamViewType, this.#table.ttlAttribute);

		return this;
	}

	/**
	 * Adds a {@link ProvisionedThroughput} specification and returns the
	 * current instance.
	 *
	 * @public
	 * @param {number} readUnits
	 * @param {number} writeUnits
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

		this.#table = new Table(this.#table.name, this.#table.keys, this.#table.indices, this.#table.attributes, this.#table.components, provisionedThroughputBuilder.provisionedThroughput, this.#table.streamViewType, this.#table.ttlAttribute);

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
		this.#table = new Table(this.#table.name, this.#table.keys, this.#table.indices, this.#table.attributes, this.#table.components, null, this.#table.streamViewType, this.#table.ttlAttribute);

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

		this.#table = new Table(this.#table.name, this.#table.keys, this.#table.indices, this.#table.attributes, this.#table.components, this.#table.provisionedThroughput, streamViewType, this.#table.ttlAttribute);

		return this;
	}

	/**
	 * Defines field that stores expiration time.
	 *
	 * @public
	 * @param {string} attributeName
	 * @returns {TableBuilder}
	 */
	withTimeToLive(attributeName) {
		assert.argumentIsRequired(attributeName, 'attributeName', String);

		this.#table = new Table(this.#table.name, this.#table.keys, this.#table.indices, this.#table.attributes, this.#table.components, this.#table.provisionedThroughput, this.#table.streamViewType, attributeName);

		return this;
	}

	/**
	 * Creates a new {@link TableBuilder}.
	 *
	 * @public
	 * @static
	 * @param {string} name - Name of the table.
	 * @returns {TableBuilder}
	 */
	static withName(name) {
		return new TableBuilder(name);
	}

	/**
	 * Creates or returns from definition.
	 *
	 * @public
	 * @static
	 * @param {*} definition
	 * @returns {*}
	 */
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

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[TableBuilder]';
	}
}

/**
 * A callback that provides the consumer with an {@link AttributeBuilder}
 *
 * @public
 * @callback AttributeBuilderCallback
 * @param {AttributeBuilder} attributeBuilder
 */

/**
 * A callback that provides the consumer with a {@link ComponentBuilder}
 *
 * @public
 * @callback ComponentBuilderCallback
 * @param {ComponentBuilder} componentBuilder
 */

/**
 * A callback that provides the consumer with a {@link TableBuilder} -- assuming
 * the configuration applies to the correct environment (i.e. {@link LambdaStage}).
 *
 * @public
 * @callback StageCallback
 * @param {TableBuilder} tableBuilder
 */
