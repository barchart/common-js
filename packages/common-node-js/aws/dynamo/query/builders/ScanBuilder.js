import * as assert from '@barchart/common-js/lang/assert.js';

import Scan from './../definitions/Scan.js';
import Table from './../../schema/definitions/Table.js';
import ActionBuilder from './ActionBuilder.js';
import FilterBuilder from './FilterBuilder.js';

/**
 * @typedef {import('../definitions/Action.js').default} Action
 */

/**
 * Fluent interface for building a {@link Scan}.
 *
 * @public
 * @extends {ActionBuilder}
 */
export default class ScanBuilder extends ActionBuilder {
	#scan;

	/**
	 * @param {Table} table - The table targeted.
	 */
	constructor(table) {
		super();

		this.#scan = new Scan(table);
	}

	/**
	 * The {@link Action}, given all the information provided thus far.
	 *
	 * @public
	 * @returns {Action}
	 */
	get action() {
		return this.#scan;
	}

	/**
	 * The {@link Scan}, given all the information provided thus far.
	 *
	 * @public
	 * @returns {Scan}
	 */
	get scan() {
		return this.#scan;
	}

	/**
	 * Adds a {@link Filter} to the scan, using a callback that
	 * provides the consumer with a {@link FilterBuilder} then
	 * returns the current instance.
	 *
	 * @public
	 * @param {Function} callback - Synchronously called, providing a {@link FilterBuilder} tied to the current instance.
	 * @returns {ScanBuilder}
	 */
	withFilterBuilder(callback) {
		assert.argumentIsRequired(callback, 'callback', Function);

		const filterBuilder = new FilterBuilder(this);

		callback(filterBuilder);

		this.#scan = new Scan(this.#scan.table, this.#scan.index, filterBuilder.filter, this.#scan.attributes, this.#scan.limit, this.#scan.segment, this.#scan.totalSegments, this.#scan.consistentRead, this.#scan.skipDeserialization, this.#scan.countOnly, this.#scan.description, this.#scan.monitorCapacityConsumed, this.#scan.exclusiveStartKey);

		return this;
	}

	/**
	 * Changes the action target to an index of the table (instead of the
	 * table itself) and returns the current instance.
	 *
	 * @public
	 * @param {string} indexName - The {@link Index} to target.
	 * @returns {ScanBuilder}
	 */
	withIndex(indexName) {
		assert.argumentIsRequired(indexName, 'indexName', String);

		this.#scan = new Scan(this.#scan.table, getIndex(indexName, this.#scan.table), this.#scan.filter, this.#scan.attributes, this.#scan.limit, this.#scan.segment, this.#scan.totalSegments, this.#scan.consistentRead, this.#scan.skipDeserialization, this.#scan.countOnly, this.#scan.description, this.#scan.monitorCapacityConsumed, this.#scan.exclusiveStartKey);

		return this;
	}

	/**
	 * The name of an attribute to select.
	 *
	 * @public
	 * @param {string} attributeName
	 * @returns {ScanBuilder}
	 */
	withAttribute(attributeName) {
		assert.argumentIsRequired(attributeName, 'attributeName', String);

		const attribute = getAttribute(attributeName, this.#scan.table);

		if (attribute !== null) {
			const attributes = this.#scan.attributes;

			if (!attributes.some(a => a.name === attribute.name)) {
				attributes.push(attribute);

				this.#scan = new Scan(this.#scan.table, this.#scan.index, this.#scan.filter, attributes, this.#scan.limit, this.#scan.segment, this.#scan.totalSegments, this.#scan.consistentRead, this.#scan.skipDeserialization, this.#scan.countOnly, this.#scan.description, this.#scan.monitorCapacityConsumed, this.#scan.exclusiveStartKey);
			}
		}

		return this;
	}

	/**
	 * Sets a hard limit to the number of results returned from the scan.
	 *
	 * @public
	 * @param {number} limit
	 * @returns {ScanBuilder}
	 */
	withLimit(limit) {
		assert.argumentIsRequired(limit, 'limit', Number);

		this.#scan = new Scan(this.#scan.table, this.#scan.index, this.#scan.filter, this.#scan.attributes, limit, this.#scan.segment, this.#scan.totalSegments, this.#scan.consistentRead, this.#scan.skipDeserialization, this.#scan.countOnly, this.#scan.description, this.#scan.monitorCapacityConsumed, this.#scan.exclusiveStartKey);

		return this;
	}

	/**
	 * Sets a segmentation for parallel scan.
	 *
	 * @public
	 * @param {number} segment
	 * @param {number} totalSegments
	 * @returns {ScanBuilder}
	 */
	withConcurrency(segment, totalSegments) {
		this.#scan = new Scan(this.#scan.table, this.#scan.index, this.#scan.filter, this.#scan.attributes, this.#scan.limit, segment, totalSegments, this.#scan.consistentRead, this.#scan.skipDeserialization, this.#scan.countOnly, this.#scan.description, this.#scan.monitorCapacityConsumed, this.#scan.exclusiveStartKey);

		return this;
	}

	/**
	 * Adds a description to the scan and returns the current instance.
	 *
	 * @public
	 * @param {string} description
	 * @returns {ScanBuilder}
	 */
	withDescription(description) {
		assert.argumentIsRequired(description, 'description', String);

		this.#scan = new Scan(this.#scan.table, this.#scan.index, this.#scan.filter, this.#scan.attributes, this.#scan.limit, this.#scan.segment, this.#scan.totalSegments, this.#scan.consistentRead, this.#scan.skipDeserialization, this.#scan.countOnly, description, this.#scan.monitorCapacityConsumed, this.#scan.exclusiveStartKey);

		return this;
	}

	/**
	 * Adds a directive to use a consistent read to the scan.
	 *
	 * @public
	 * @returns {ScanBuilder}
	 */
	withConsistentRead() {
		this.#scan = new Scan(this.#scan.table, this.#scan.index, this.#scan.filter, this.#scan.attributes, this.#scan.limit, this.#scan.segment, this.#scan.totalSegments, true, this.#scan.skipDeserialization, this.#scan.countOnly, this.#scan.description, this.#scan.monitorCapacityConsumed, this.#scan.exclusiveStartKey);

		return this;
	}

	/**
	 * Adds a directive to skip deserialization and return records in
	 * DynamoDB format.
	 *
	 * @public
	 * @returns {ScanBuilder}
	 */
	withDeserializationSkipped() {
		this.#scan = new Scan(this.#scan.table, this.#scan.index, this.#scan.filter, this.#scan.attributes, this.#scan.limit, this.#scan.segment, this.#scan.totalSegments, this.#scan.consistentRead, true, this.#scan.countOnly, this.#scan.description, this.#scan.monitorCapacityConsumed, this.#scan.exclusiveStartKey);

		return this;
	}

	/**
	 * Adds a directive to return a record count, instead of the records themselves.
	 *
	 * @public
	 * @returns {ScanBuilder}
	 */
	withCount() {
		this.#scan = new Scan(this.#scan.table, this.#scan.index, this.#scan.filter, this.#scan.attributes, this.#scan.limit, this.#scan.segment, this.#scan.totalSegments, this.#scan.consistentRead, this.#scan.skipDeserialization, true, this.#scan.description, this.#scan.monitorCapacityConsumed, this.#scan.exclusiveStartKey);

		return this;
	}

	/**
	 * Adds a directive to track RCU (read capacity units) consumed by the scan's execution;
	 *
	 * @public
	 * @returns {ScanBuilder}
	 */
	withCapacityMonitored() {
		this.#scan = new Scan(this.#scan.table, this.#scan.index, this.#scan.filter, this.#scan.attributes, this.#scan.limit, this.#scan.segment, this.#scan.totalSegments, this.#scan.consistentRead, this.#scan.skipDeserialization, this.#scan.countOnly, this.#scan.description, true, this.#scan.exclusiveStartKey);

		return this;
	}

    /**
     * Sets the exclusive start key for the scan.
     *
     * @public
     * @param {boolean} exclusiveStartKey - The exclusive start key.
     * @returns {ScanBuilder}
     */
    withExclusiveStartKey(exclusiveStartKey){
        assert.argumentIsRequired(exclusiveStartKey, 'exclusiveStartKey', Object);

        this.#scan = new Scan(this.#scan.table, this.#scan.index, this.#scan.filter, this.#scan.attributes, this.#scan.limit, this.#scan.segment, this.#scan.totalSegments, this.#scan.consistentRead, this.#scan.skipDeserialization, this.#scan.countOnly, this.#scan.description, this.#scan.monitorCapacityConsumed, exclusiveStartKey);

        return this;
    }

	/**
	 * Creates a new {@link ScanBuilder}.
	 *
	 * @public
	 * @static
	 * @param {Table} table
	 * @returns {ScanBuilder}
	 */
	static targeting(table) {
		assert.argumentIsRequired(table, 'table', Table, 'Table');

		return new ScanBuilder(table);
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[ScanBuilder]';
	}
}

function getIndex(name, table) {
	return table.indices.find(i => i.name === name) || null;
}

function getAttribute(name, table) {
	return table.attributes.find(a => a.name === name) || null;
}
