const assert = require('@barchart/common-js/lang/assert'),
	is = require('@barchart/common-js/lang/is');

const KeyType = require('./../../schema/definitions/KeyType'),
	OrderingType = require('./../definitions/OrderingType'),
	Query = require('./../definitions/Query'),
	Table = require('./../../schema/definitions/Table');

const ActionBuilder = require('./ActionBuilder'),
	FilterBuilder = require('./FilterBuilder');

const Expression = require('./../definitions/Expression'),
	Filter = require('./../definitions/Filter'),
	OperatorType = require('./../definitions/OperatorType');

module.exports = (() => {
	'use strict';

	/**
	 * Fluent interface for building a {@link Query}.
	 *
	 * @public
	 * @extends {ActionBuilder}
	 * @param {Table} table - The table targeted.
	 */
	class QueryBuilder extends ActionBuilder {
		constructor(table) {
			super();

			this._query = new Query(table);
		}

		/**
		 * The {@link Action}, given all the information provided thus far.
		 *
		 * @public
		 * @returns {Action}
		 */
		get action() {
			return this._query;
		}

		/**
		 * The {@link Query}, given all the information provided thus far.
		 *
		 * @public
		 * @returns {Query}
		 */
		get query() {
			return this._query;
		}

		/**
		 * Changes the action target to an index of the table (instead of the
		 * table itself) and returns the current instance.
		 *
		 * @public
		 * @param {String} indexName - The {@link Index} to target.
		 * @returns {QueryBuilder}
		 */
		withIndex(indexName) {
			assert.argumentIsRequired(indexName, 'indexName', String);

			this._query = new Query(this._query.table, getIndex(indexName, this._query.table), this._query.keyFilter, this._query.resultsFilter, this._query.parallelFilter, this._query.attributes, this._query.limit, this._query.orderingType, this._query.consistentRead, this._query.skipDeserialization, this._query.countOnly, this._query.description, this._query.monitorCapacityConsumed, this._query.exclusiveStartKey);

			return this;
		}

		/**
		 * Adds a {@link Filter} targeting the table's (or indexes) key. Uses a callback
		 * to provides the consumer with a {@link FilterBuilder}.
		 *
		 * @public
		 * @param {Function} callback - Synchronously called, providing a {@link FilterBuilder} tied to the current instance.
		 * @returns {QueryBuilder}
		 */
		withKeyFilterBuilder(callback) {
			assert.argumentIsRequired(callback, 'callback', Function);

			const filterBuilder = new FilterBuilder(this);

			callback(filterBuilder);

			this._query = new Query(this._query.table, this._query.index, filterBuilder.filter, this._query.resultsFilter, this._query.parallelFilter, this._query.attributes, this._query.limit, this._query.orderingType, this._query.consistentRead, this._query.skipDeserialization, this._query.countOnly, this._query.description, this._query.monitorCapacityConsumed, this._query.exclusiveStartKey);

			return this;
		}

		/**
		 * Adds a {@link Filter} to the query which results after the key filter has
		 * been evaluated. Uses a callback to provides the consumer with a {@link FilterBuilder}.
		 *
		 * @public
		 * @param {Function} callback - Synchronously called, providing a {@link FilterBuilder} tied to the current instance.
		 * @returns {QueryBuilder}
		 */
		withResultsFilterBuilder(callback) {
			assert.argumentIsRequired(callback, 'callback', Function);

			const filterBuilder = new FilterBuilder(this);

			callback(filterBuilder);

			this._query = new Query(this._query.table, this._query.index, this._query.keyFilter, filterBuilder.filter, this._query.parallelFilter, this._query.attributes, this._query.limit, this._query.orderingType, this._query.consistentRead, this._query.skipDeserialization, this._query.countOnly, this._query.description, this._query.monitorCapacityConsumed, this._query.exclusiveStartKey);

			return this;
		}

		/**
		 * The name of an attribute to select.
		 *
		 * @public
		 * @param {String} attributeName
		 * @returns {QueryBuilder}
		 */
		withAttribute(attributeName) {
			assert.argumentIsRequired(attributeName, 'attributeName', String);

			const attribute = getAttribute(attributeName, this._query.table);

			if (attribute !== null) {
				const attributes = this._query.attributes;

				if (!attributes.some(a => a.name === attribute.name)) {
					attributes.push(attribute);

					this._query = new Query(this._query.table, this._query.index, this._query.keyFilter, this._query.resultsFilter, this._query.parallelFilter, attributes, this._query.limit, this._query.orderingType, this._query.consistentRead, this._query.skipDeserialization, this._query.countOnly, this._query.description, this._query.monitorCapacityConsumed, this._query.exclusiveStartKey);
				}
			}

			return this;
		}

		/**
		 * Sets a hard limit to the number of results returned from the query.
		 *
		 * @public
		 * @param {Number} limit
		 * @returns {QueryBuilder}
		 */
		withLimit(limit) {
			assert.argumentIsRequired(limit, 'limit', Number);

			this._query = new Query(this._query.table, this._query.index, this._query.keyFilter, this._query.resultsFilter, this._query.parallelFilter, this._query.attributes, limit, this._query.orderingType, this._query.consistentRead, this._query.skipDeserialization, this._query.countOnly, this._query.description, this._query.monitorCapacityConsumed, this._query.exclusiveStartKey);

			return this;
		}

		/**
		 * Adds a description to the query and returns the current instance.
		 *
		 * @public
		 * @param {String} description
		 * @returns {QueryBuilder}
		 */
		withDescription(description) {
			assert.argumentIsRequired(description, 'description', String);

			this._query = new Query(this._query.table, this._query.index, this._query.keyFilter, this._query.resultsFilter, this._query.parallelFilter, this._query.attributes, this._query.limit, this._query.orderingType, this._query.consistentRead, this._query.skipDeserialization, this._query.countOnly, description, this._query.monitorCapacityConsumed, this._query.exclusiveStartKey);

			return this;
		}

		/**
		 * Sets the direction of index processing (and the order of the results).
		 *
		 * @public
		 * @param {OrderingType} orderingType
		 * @returns {QueryBuilder}
		 */
		withOrderingType(orderingType) {
			assert.argumentIsRequired(orderingType, 'orderingType', OrderingType, 'OrderingType');

			this._query = new Query(this._query.table, this._query.index, this._query.keyFilter, this._query.resultsFilter, this._query.parallelFilter, this._query.attributes, this._query.limit, orderingType, this._query.consistentRead, this._query.skipDeserialization, this._query.countOnly, this._query.description, this._query.monitorCapacityConsumed, this._query.exclusiveStartKey);

			return this;
		}

		/**
		 * Adds a directive to use a consistent read to the query.
		 *
		 * @public
		 * @returns {QueryBuilder}
		 */
		withConsistentRead() {
			this._query = new Query(this._query.table, this._query.index, this._query.keyFilter, this._query.resultsFilter, this._query.parallelFilter, this._query.attributes, this._query.limit, this._query.orderingType, true, this._query.skipDeserialization, this._query.countOnly, this._query.description, this._query.monitorCapacityConsumed, this._query.exclusiveStartKey);

			return this;
		}

		/**
		 * Adds a directive to skip deserialization and return records in
		 * DynamoDB format.
		 *
		 * @public
		 * @returns {QueryBuilder}
		 */
		withDeserializationSkipped() {
			this._query = new Query(this._query.table, this._query.index, this._query.keyFilter, this._query.resultsFilter, this._query.parallelFilter, this._query.attributes, this._query.limit, this._query.orderingType, this._query.consistentRead, true, this._query.countOnly, this._query.description, this._query.monitorCapacityConsumed, this._query.exclusiveStartKey);

			return this;
		}

		/**
		 * Adds a directive to return a record count, instead of the records themselves.
		 *
		 * @public
		 * @returns {QueryBuilder}
		 */
		withCount() {
			this._query = new Query(this._query.table, this._query.index, this._query.keyFilter, this._query.resultsFilter, this._query.parallelFilter, this._query.attributes, this._query.limit, this._query.orderingType, this._query.consistentRead, this._query.skipDeserialization, true, this._query.description, this._query.monitorCapacityConsumed, this._query.exclusiveStartKey);

			return this;
		}

		/**
		 * Adds a directive to track RCU (read capacity units) consumed by the query's execution;
		 *
		 * @public
		 * @returns {QueryBuilder}
		 */
		withCapacityMonitored() {
			this._query = new Query(this._query.table, this._query.index, this._query.keyFilter, this._query.resultsFilter, this._query.parallelFilter, this._query.attributes, this._query.limit, this._query.orderingType, this._query.consistentRead, this._query.skipDeserialization, this._query.countOnly, this._query.description, true, this._query.exclusiveStartKey);

			return this;
		}

        /**
         * Sets the exclusive start key for the query.
         *
         * @public
         * @param exclusiveStartKey
         * @returns {QueryBuilder}
         */
        withExclusiveStartKey(exclusiveStartKey){
            assert.argumentIsRequired(exclusiveStartKey, 'exclusiveStartKey', Object);

            this._query = new Query(this._query.table, this._query.index, this._query.keyFilter, this._query.resultsFilter, this._query.parallelFilter, this._query.attributes, this._query.limit, this._query.orderingType, this._query.consistentRead, this._query.skipDeserialization, this._query.countOnly, this._query.description, this._query.monitorCapacityConsumed, exclusiveStartKey);

            return this;
        }

		/**
		 * Spawns an array of {@link Query} instances, each having the same properties
		 * as the current {@link QueryBuilder}. However, each query is modified to return
		 * a subset of results by adding additional filters to the range key, according
		 * to instructions provided by the range extractor function.
		 *
		 * @public
		 * @param {QueryBuilder~rangeExtractor} rangeExtractor
		 * @returns {Query[]}
		 */
		toParallelQueries(rangeExtractor) {
			assert.argumentIsRequired(rangeExtractor, 'rangeExtractor', Function);

			if (this.query.countOnly) {
				throw new Error('Count queries cannot be run in parallel.');
			}

			const table = this._query.table;

			let rangeKey;

			if (this._query.index === null) {
				rangeKey = table.rangeKey;
			} else {
				const keys = this._query.index.keys;

				rangeKey = keys.find(k => k.keyType === KeyType.RANGE) || null;
			}

			if (rangeKey === null) {
				throw new Error('Unable to use parallelism on a table without a range key.');
			}

			const ranges = rangeExtractor(table);

			if (this._query.orderingType === OrderingType.DESCENDING) {
				ranges.reverse();
			}

			return ranges.map((range, i) => {
				const start = range.start;
				const end = range.end;

				let expression;

				if (!is.null(end) && !is.undefined(end)) {
					expression = new Expression(rangeKey.attribute, OperatorType.BETWEEN, [ start, end ]);
				} else {
					expression = new Expression(rangeKey.attribute, OperatorType.GREATER_THAN_OR_EQUAL_TO, start);
				}

				const parallelFilter = new Filter([ expression ]);

				return new Query(this._query.table, this._query.index, this._query.keyFilter, this._query.resultsFilter, parallelFilter, this._query.attributes, this._query.limit, this._query.orderingType, this._query.consistentRead, this._query.skipDeserialization, false, `${this._query.description} [ ${i} ]`, this._query.monitorCapacityConsumed);
			});
		}

		/**
		 * Creates a new {@link QueryBuilder}.
		 *
		 * @public
		 * @static
		 * @param {Table} table
		 * @returns {QueryBuilder}
		 */
		static targeting(table) {
			assert.argumentIsRequired(table, 'table', Table, 'Table');

			return new QueryBuilder(table);
		}

		toString() {
			return '[QueryBuilder]';
		}
	}

	function getIndex(name, table) {
		return table.indices.find(i => i.name === name) || null;
	}

	function getAttribute(name, table) {
		return table.attributes.find(a => a.name === name) || null;
	}

	/**
	 * Data regarding a single Lambda function invocation
	 *
	 * @typedef Range
	 * @type {Object}
	 * @property {*} start
	 * @property {*|null|undefined} end
	 */

	/**
	 * A callback that provides the consumer with an {@link AttributeBuilder}
	 *
	 * @public
	 * @callback QueryBuilder~rangeExtractor
	 * @param {Table} table
	 * @returns {Range[]}
	 */

	return QueryBuilder;
})();
