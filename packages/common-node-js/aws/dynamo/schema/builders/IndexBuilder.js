const assert = require('@barchart/common-js/lang/assert');

const Index = require('./../definitions/Index'),
	IndexType = require('./../definitions/IndexType'),
	Projection = require('./../definitions/Projection'),
	ProjectionType = require('./../definitions/ProjectionType');

const KeyBuilder = require('./KeyBuilder'),
	ProjectionBuilder = require('./ProjectionBuilder'),
	ProvisionedThroughputBuilder = require('./ProvisionedThroughputBuilder');

const LambdaStage = require('../../../lambda/LambdaStage');
const Table = require("../definitions/Table");

module.exports = (() => {
	'use strict';

	/**
	 * Fluent interface for building an {@link Index}.
	 *
	 * @public
	 * @param {string} name
	 * @param {TableBuilder} parent
	 */
	class IndexBuilder {
		constructor(name, parent) {
			assert.argumentIsRequired(name, 'name', String);

			this._index = new Index(name, null, [ ], null, null);
			this._parent = parent;
		}

		/**
		 * The {@link Index}, given all the information provided thus far.
		 *
		 * @public
		 * @returns {Index}
		 */
		get index() {
			return this._index;
		}

		/**
		 * Adds a logic for specific environment (via a callback that fires
		 * if the current configuration applies to the desired environment).
		 *
		 * @public
		 * @param {LambdaStage} stage
		 * @param {IndexBuilder~stageCallback} callback
		 * @return {IndexBuilder}
		 */
		forStage(stage, callback) {
			assert.argumentIsRequired(stage, 'stage', LambdaStage, 'LambdaStage');
			assert.argumentIsRequired(callback, 'callback', Function);

			if (LambdaStage.getStageFromName(this._parent.table.name) === stage) {
				callback(this);
			}

			return this;
		}

		/**
		 * Sets the {@link IndexType} and returns the current instance.
		 *
		 * @public
		 * @param {IndexType} type
		 * @returns {IndexBuilder}
		 */
		withType(type) {
			assert.argumentIsRequired(type, 'type', IndexType, 'IndexType');

			this._index = new Index(this._index.name, type, this._index.keys, this._index.projection, this._index.provisionedThroughput);

			return this;
		}

		/**
		 * Adds a {@link Key} to the index, given all the components of an
		 * key, then returns the current instance.
		 *
		 * @public
		 * @param {string} name - The key name.
		 * @param {KeyType} keyType
		 * @returns {IndexBuilder}
		 */
		withKey(name, keyType) {
			return this.withKeyBuilder(name, kb => kb.withKeyType(keyType));
		}

		/**
		 * Adds an {@link Key} to the index, using a callback that
		 * provides the consumer with a {@KeyBuilder}, then returns
		 * the current instance.
		 *
		 * @public
		 * @param {string} name - The key name.
		 * @param {Function} callback - Synchronously called, providing a {@link KeyBuilder} tied to the current instance.
		 * @returns {IndexBuilder}
		 */
		withKeyBuilder(name, callback) {
			assert.argumentIsRequired(callback, 'callback', Function);

			const keyBuilder = new KeyBuilder(name, this._parent);

			callback(keyBuilder);

			const key = keyBuilder.key;
			const keys = this._index.keys.filter(k => k.attribute.name !== key.attribute.name).concat(key);

			this._index = new Index(this._index.name, this._index.type, keys, this._index.projection, this._index.provisionedThroughput);

			return this;
		}

		/**
		 * Adds a {@link Projection} to the index, given all the components
		 * of a projection, then returns the current instance.
		 *
		 * @public
		 * @param {ProjectionType} projectionType
		 * @param {Array<String>=} attributeNames
		 * @returns {IndexBuilder}
		 */
		withProjection(projectionType, attributeNames) {
			const namesToUse = attributeNames || [ ];

			return this.withProjectionBuilder(projectionType, pb => namesToUse.forEach(n => pb.withAttribute(n)));
		}

		/**
		 * Adds an {@link Projection} to the index, using a callback that
		 * provides the consumer with a {@ProjectionBuilder}, then returns
		 * the current instance.
		 *
		 * @public
		 * @param {ProjectionType} projectionType
		 * @param {Function} callback - Synchronously called, providing a {@link ProjectionBuilder} tied to the current instance.
		 * @returns {IndexBuilder}
		 */
		withProjectionBuilder(projectionType, callback) {
			assert.argumentIsRequired(callback, 'callback', Function);

			const projectionBuilder = new ProjectionBuilder(projectionType, this._parent);

			callback(projectionBuilder);

			this._index = new Index(this._index.name, this._index.type, this._index.keys, projectionBuilder.projection, this._index.provisionedThroughput);

			return this;
		}

		/**
		 * Adds a {@link ProvisionedThroughput} specification to the index
		 * then returns the current instance.
		 *
		 * @public
		 * @param {Number} readUnits
		 * @param {Number} writeUnits
		 * @returns {IndexBuilder}
		 */
		withProvisionedThroughput(readUnits, writeUnits) {
			const provisionedThroughputBuilder = new ProvisionedThroughputBuilder(readUnits, writeUnits);

			return this.withProvisionedThroughputBuilder(provisionedThroughputBuilder);
		}

		/**
		 * Adds an {@link ProvisionedThroughput} specification to the index, using
		 * a callback that provides the consumer with a {@ProvisionedThroughputBuilder},
		 * then returns the current instance.
		 *
		 * @public
		 * @param {ProvisionedThroughputBuilder} provisionedThroughputBuilder
		 * @returns {IndexBuilder}
		 */
		withProvisionedThroughputBuilder(provisionedThroughputBuilder) {
			assert.argumentIsRequired(provisionedThroughputBuilder, 'provisionedThroughputBuilder', ProvisionedThroughputBuilder, 'ProvisionedThroughputBuilder');

			this._index = new Index(this._index.name, this._index.type, this._index.keys, this._index.projection, provisionedThroughputBuilder.provisionedThroughput);

			return this;
		}

		/**
		 * Indicates the index should use on-demand throughput (i.e. pricing), instead of
		 * provisioned throughput.
		 *
		 * @public
		 * @returns {IndexBuilder}
		 */
		withOnDemandThroughput() {
			this._index = new Index(this._index.name, this._index.type, this._index.keys, this._index.projection, null);

			return this;
		}

		toString() {
			return '[IndexBuilder]';
		}
	}

	/**
	 * A callback that provides the consumer with an {@link IndexBuilder} -- assuming
	 * the configuration applies to the correct environment (i.e. {@link LambdaStage}).
	 *
	 * @public
	 * @callback IndexBuilder~stageCallback
	 * @param {IndexBuilder} indexBuilder
	 */

	return IndexBuilder;
})();
