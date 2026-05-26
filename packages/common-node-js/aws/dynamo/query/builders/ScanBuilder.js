const assert = require('@barchart/common-js/lang/assert');

const Scan = require('./../definitions/Scan'),
	Table = require('./../../schema/definitions/Table');

const ActionBuilder = require('./ActionBuilder'),
	FilterBuilder = require('./FilterBuilder');

module.exports = (() => {
	'use strict';

	/**
	 * Fluent interface for building a {@link Scan}.
	 *
	 * @public
	 * @extends {ActionBuilder}
	 * @param {Table} table - The table targeted.
	 */
	class ScanBuilder extends ActionBuilder {
		constructor(table) {
			super();

			this._scan = new Scan(table);
		}

		/**
		 * The {@link Action}, given all the information provided thus far.
		 *
		 * @public
		 * @returns {Action}
		 */
		get action() {
			return this._scan;
		}

		/**
		 * The {@link Scan}, given all the information provided thus far.
		 *
		 * @public
		 * @returns {Scan}
		 */
		get scan() {
			return this._scan;
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

			this._scan = new Scan(this._scan.table, this._scan.index, filterBuilder.filter, this._scan.attributes, this._scan.limit, this._scan.segment, this._scan.totalSegments, this._scan.consistentRead, this._scan.skipDeserialization, this._scan.countOnly, this._scan.description, this._scan.monitorCapacityConsumed, this._scan.exclusiveStartKey);

			return this;
		}

		/**
		 * Changes the action target to an index of the table (instead of the
		 * table itself) and returns the current instance.
		 *
		 * @public
		 * @param {String} indexName - The {@link Index} to target.
		 * @returns {ScanBuilder}
		 */
		withIndex(indexName) {
			assert.argumentIsRequired(indexName, 'indexName', String);

			this._scan = new Scan(this._scan.table, getIndex(indexName, this._scan.table), this._scan.filter, this._scan.attributes, this._scan.limit, this._scan.segment, this._scan.totalSegments, this._scan.consistentRead, this._scan.skipDeserialization, this._scan.countOnly, this._scan.description, this._scan.monitorCapacityConsumed, this._scan.exclusiveStartKey);

			return this;
		}

		/**
		 * The name of an attribute to select.
		 *
		 * @public
		 * @param {String} attributeName
		 * @returns {ScanBuilder}
		 */
		withAttribute(attributeName) {
			assert.argumentIsRequired(attributeName, 'attributeName', String);

			const attribute = getAttribute(attributeName, this._scan.table);

			if (attribute !== null) {
				const attributes = this._scan.attributes;

				if (!attributes.some(a => a.name === attribute.name)) {
					attributes.push(attribute);

					this._scan = new Scan(this._scan.table, this._scan.index, this._scan.filter, attributes, this._scan.limit, this._scan.segment, this._scan.totalSegments, this._scan.consistentRead, this._scan.skipDeserialization, this._scan.countOnly, this._scan.description, this._scan.monitorCapacityConsumed, this._scan.exclusiveStartKey);
				}
			}

			return this;
		}

		/**
		 * Sets a hard limit to the number of results returned from the scan.
		 *
		 * @public
		 * @param {Number} limit
		 * @returns {ScanBuilder}
		 */
		withLimit(limit) {
			assert.argumentIsRequired(limit, 'limit', Number);

			this._scan = new Scan(this._scan.table, this._scan.index, this._scan.filter, this._scan.attributes, limit, this._scan.segment, this._scan.totalSegments, this._scan.consistentRead, this._scan.skipDeserialization, this._scan.countOnly, this._scan.description, this._scan.monitorCapacityConsumed, this._scan.exclusiveStartKey);

			return this;
		}

		/**
		 * Sets a segmentation for parallel scan.
		 *
		 * @public
		 * @param {Number} segment
		 * @param {Number} totalSegments
		 * @returns {ScanBuilder}
		 */
		withConcurrency(segment, totalSegments) {
			this._scan = new Scan(this._scan.table, this._scan.index, this._scan.filter, this._scan.attributes, this._scan.limit, segment, totalSegments, this._scan.consistentRead, this._scan.skipDeserialization, this._scan.countOnly, this._scan.description, this._scan.monitorCapacityConsumed, this._scan.exclusiveStartKey);

			return this;
		}

		/**
		 * Adds a description to the scan and returns the current instance.
		 *
		 * @public
		 * @param {String} description
		 * @returns {ScanBuilder}
		 */
		withDescription(description) {
			assert.argumentIsRequired(description, 'description', String);

			this._scan = new Scan(this._scan.table, this._scan.index, this._scan.filter, this._scan.attributes, this._scan.limit, this._scan.segment, this._scan.totalSegments, this._scan.consistentRead, this._scan.skipDeserialization, this._scan.countOnly, description, this._scan.monitorCapacityConsumed, this._scan.exclusiveStartKey);

			return this;
		}

		/**
		 * Adds a directive to use a consistent read to the scan.
		 *
		 * @public
		 * @returns {ScanBuilder}
		 */
		withConsistentRead() {
			this._scan = new Scan(this._scan.table, this._scan.index, this._scan.filter, this._scan.attributes, this._scan.limit, this._scan.segment, this._scan.totalSegments, true, this._scan.skipDeserialization, this._scan.countOnly, this._scan.description, this._scan.monitorCapacityConsumed, this._scan.exclusiveStartKey);

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
			this._scan = new Scan(this._scan.table, this._scan.index, this._scan.filter, this._scan.attributes, this._scan.limit, this._scan.segment, this._scan.totalSegments, this._scan.consistentRead, true, this._scan.countOnly, this._scan.description, this._scan.monitorCapacityConsumed, this._scan.exclusiveStartKey);

			return this;
		}

		/**
		 * Adds a directive to return a record count, instead of the records themselves.
		 *
		 * @public
		 * @returns {ScanBuilder}
		 */
		withCount() {
			this._scan = new Scan(this._scan.table, this._scan.index, this._scan.filter, this._scan.attributes, this._scan.limit, this._scan.segment, this._scan.totalSegments, this._scan.consistentRead, this._scan.skipDeserialization, true, this._scan.description, this._scan.monitorCapacityConsumed, this._scan.exclusiveStartKey);

			return this;
		}

		/**
		 * Adds a directive to track RCU (read capacity units) consumed by the scan's execution;
		 *
		 * @public
		 * @returns {ScanBuilder}
		 */
		withCapacityMonitored() {
			this._scan = new Scan(this._scan.table, this._scan.index, this._scan.filter, this._scan.attributes, this._scan.limit, this._scan.segment, this._scan.totalSegments, this._scan.consistentRead, this._scan.skipDeserialization, this._scan.countOnly, this._scan.description, true, this._scan.exclusiveStartKey);

			return this;
		}

        /**
         * Sets the exclusive start key for the scan.
         *
         * @public
         * @param exclusiveStartKey
         * @returns {ScanBuilder}
         */
        withExclusiveStartKey(exclusiveStartKey){
            assert.argumentIsRequired(exclusiveStartKey, 'exclusiveStartKey', Object);

            this._scan = new Scan(this._scan.table, this._scan.index, this._scan.filter, this._scan.attributes, this._scan.limit, this._scan.segment, this._scan.totalSegments, this._scan.consistentRead, this._scan.skipDeserialization, this._scan.countOnly, this._scan.description, this._scan.monitorCapacityConsumed, exclusiveStartKey);

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

	return ScanBuilder;
})();
