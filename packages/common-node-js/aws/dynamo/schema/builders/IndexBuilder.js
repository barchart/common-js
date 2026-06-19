import * as assert from '@barchart/common-js/lang/assert.js';

import Index from './../definitions/Index.js';
import IndexType from './../definitions/IndexType.js';
import KeyBuilder from './KeyBuilder.js';
import ProjectionBuilder from './ProjectionBuilder.js';
import ProvisionedThroughputBuilder from './ProvisionedThroughputBuilder.js';
import LambdaStage from '../../../lambda/LambdaStage.js';

/**
 * @typedef {import('./TableBuilder.js').default} TableBuilder
 * @typedef {import('../definitions/KeyType.js').default} KeyType
 * @typedef {import('./../definitions/ProjectionType.js').default} ProjectionType
 */

/**
 * Fluent interface for building an {@link Index}.
 *
 * @public
 */
export default class IndexBuilder {
	#index;
	#parent;

	/**
	 * @param {string} name
	 * @param {TableBuilder} parent
	 */
	constructor(name, parent) {
		assert.argumentIsRequired(name, 'name', String);

		this.#index = new Index(name, null, [ ], null, null);
		this.#parent = parent;
	}

	/**
	 * The {@link Index}, given all the information provided thus far.
	 *
	 * @public
	 * @returns {Index}
	 */
	get index() {
		return this.#index;
	}

	/**
	 * Adds a logic for specific environment (via a callback that fires
	 * if the current configuration applies to the desired environment).
	 *
	 * @public
	 * @param {LambdaStage} stage
	 * @param {StageCallback} callback
	 * @return {IndexBuilder}
	 */
	forStage(stage, callback) {
		assert.argumentIsRequired(stage, 'stage', LambdaStage, 'LambdaStage');
		assert.argumentIsRequired(callback, 'callback', Function);

		if (LambdaStage.getStageFromName(this.#parent.table.name) === stage) {
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

		this.#index = new Index(this.#index.name, type, this.#index.keys, this.#index.projection, this.#index.provisionedThroughput);

		return this;
	}

	/**
	 * Adds a {@link Key} to the index, given all the components of a
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

		const keyBuilder = new KeyBuilder(name, this.#parent);

		callback(keyBuilder);

		const key = keyBuilder.key;
		const keys = this.#index.keys.filter(k => k.attribute.name !== key.attribute.name).concat(key);

		this.#index = new Index(this.#index.name, this.#index.type, keys, this.#index.projection, this.#index.provisionedThroughput);

		return this;
	}

	/**
	 * Adds a {@link Projection} to the index, given all the components
	 * of a projection, then returns the current instance.
	 *
	 * @public
	 * @param {ProjectionType} projectionType
	 * @param {Array<string>=} attributeNames
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

		const projectionBuilder = new ProjectionBuilder(projectionType, this.#parent);

		callback(projectionBuilder);

		this.#index = new Index(this.#index.name, this.#index.type, this.#index.keys, projectionBuilder.projection, this.#index.provisionedThroughput);

		return this;
	}

	/**
	 * Adds a {@link ProvisionedThroughput} specification to the index
	 * then returns the current instance.
	 *
	 * @public
	 * @param {number} readUnits
	 * @param {number} writeUnits
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

		this.#index = new Index(this.#index.name, this.#index.type, this.#index.keys, this.#index.projection, provisionedThroughputBuilder.provisionedThroughput);

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
		this.#index = new Index(this.#index.name, this.#index.type, this.#index.keys, this.#index.projection, null);

		return this;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[IndexBuilder]';
	}
}

/**
 * A callback that provides the consumer with an {@link IndexBuilder} -- assuming
 * the configuration applies to the correct environment (i.e. {@link LambdaStage}).
 *
 * @public
 * @callback StageCallback
 * @param {IndexBuilder} indexBuilder
 */
