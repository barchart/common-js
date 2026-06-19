import * as assert from '@barchart/common-js/lang/assert.js';
import * as is from '@barchart/common-js/lang/is.js';

import KeyType from './../../schema/definitions/KeyType.js';
import OrderingType from './../definitions/OrderingType.js';
import Query from './../definitions/Query.js';
import Table from './../../schema/definitions/Table.js';
import ActionBuilder from './ActionBuilder.js';
import FilterBuilder from './FilterBuilder.js';
import Expression from './../definitions/Expression.js';
import Filter from './../definitions/Filter.js';
import OperatorType from './../definitions/OperatorType.js';

/**
 * @typedef {import('../definitions/Action.js').default} Action
 */

/**
 * Fluent interface for building a {@link Query}.
 *
 * @public
 * @extends {ActionBuilder}
 */
export default class QueryBuilder extends ActionBuilder {
	#query;

	/**
	 * @param {Table} table - The table targeted.
	 */
	constructor(table) {
		super();

		this.#query = new Query(table);
	}

	/**
	 * The {@link Action}, given all the information provided thus far.
	 *
	 * @public
	 * @returns {Action}
	 */
	get action() {
		return this.#query;
	}

	/**
	 * The {@link Query}, given all the information provided thus far.
	 *
	 * @public
	 * @returns {Query}
	 */
	get query() {
		return this.#query;
	}

	/**
	 * Changes the action target to an index of the table (instead of the
	 * table itself) and returns the current instance.
	 *
	 * @public
	 * @param {string} indexName - The {@link Index} to target.
	 * @returns {QueryBuilder}
	 */
	withIndex(indexName) {
		assert.argumentIsRequired(indexName, 'indexName', String);

		this.#query = new Query(this.#query.table, getIndex(indexName, this.#query.table), this.#query.keyFilter, this.#query.resultsFilter, this.#query.parallelFilter, this.#query.attributes, this.#query.limit, this.#query.orderingType, this.#query.consistentRead, this.#query.skipDeserialization, this.#query.countOnly, this.#query.description, this.#query.monitorCapacityConsumed, this.#query.exclusiveStartKey);

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

		this.#query = new Query(this.#query.table, this.#query.index, filterBuilder.filter, this.#query.resultsFilter, this.#query.parallelFilter, this.#query.attributes, this.#query.limit, this.#query.orderingType, this.#query.consistentRead, this.#query.skipDeserialization, this.#query.countOnly, this.#query.description, this.#query.monitorCapacityConsumed, this.#query.exclusiveStartKey);

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

		this.#query = new Query(this.#query.table, this.#query.index, this.#query.keyFilter, filterBuilder.filter, this.#query.parallelFilter, this.#query.attributes, this.#query.limit, this.#query.orderingType, this.#query.consistentRead, this.#query.skipDeserialization, this.#query.countOnly, this.#query.description, this.#query.monitorCapacityConsumed, this.#query.exclusiveStartKey);

		return this;
	}

	/**
	 * The name of an attribute to select.
	 *
	 * @public
	 * @param {string} attributeName
	 * @returns {QueryBuilder}
	 */
	withAttribute(attributeName) {
		assert.argumentIsRequired(attributeName, 'attributeName', String);

		const attribute = getAttribute(attributeName, this.#query.table);

		if (attribute !== null) {
			const attributes = this.#query.attributes;

			if (!attributes.some(a => a.name === attribute.name)) {
				attributes.push(attribute);

				this.#query = new Query(this.#query.table, this.#query.index, this.#query.keyFilter, this.#query.resultsFilter, this.#query.parallelFilter, attributes, this.#query.limit, this.#query.orderingType, this.#query.consistentRead, this.#query.skipDeserialization, this.#query.countOnly, this.#query.description, this.#query.monitorCapacityConsumed, this.#query.exclusiveStartKey);
			}
		}

		return this;
	}

	/**
	 * Sets a hard limit to the number of results returned from the query.
	 *
	 * @public
	 * @param {number} limit
	 * @returns {QueryBuilder}
	 */
	withLimit(limit) {
		assert.argumentIsRequired(limit, 'limit', Number);

		this.#query = new Query(this.#query.table, this.#query.index, this.#query.keyFilter, this.#query.resultsFilter, this.#query.parallelFilter, this.#query.attributes, limit, this.#query.orderingType, this.#query.consistentRead, this.#query.skipDeserialization, this.#query.countOnly, this.#query.description, this.#query.monitorCapacityConsumed, this.#query.exclusiveStartKey);

		return this;
	}

	/**
	 * Adds a description to the query and returns the current instance.
	 *
	 * @public
	 * @param {string} description
	 * @returns {QueryBuilder}
	 */
	withDescription(description) {
		assert.argumentIsRequired(description, 'description', String);

		this.#query = new Query(this.#query.table, this.#query.index, this.#query.keyFilter, this.#query.resultsFilter, this.#query.parallelFilter, this.#query.attributes, this.#query.limit, this.#query.orderingType, this.#query.consistentRead, this.#query.skipDeserialization, this.#query.countOnly, description, this.#query.monitorCapacityConsumed, this.#query.exclusiveStartKey);

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

		this.#query = new Query(this.#query.table, this.#query.index, this.#query.keyFilter, this.#query.resultsFilter, this.#query.parallelFilter, this.#query.attributes, this.#query.limit, orderingType, this.#query.consistentRead, this.#query.skipDeserialization, this.#query.countOnly, this.#query.description, this.#query.monitorCapacityConsumed, this.#query.exclusiveStartKey);

		return this;
	}

	/**
	 * Adds a directive to use a consistent read to the query.
	 *
	 * @public
	 * @returns {QueryBuilder}
	 */
	withConsistentRead() {
		this.#query = new Query(this.#query.table, this.#query.index, this.#query.keyFilter, this.#query.resultsFilter, this.#query.parallelFilter, this.#query.attributes, this.#query.limit, this.#query.orderingType, true, this.#query.skipDeserialization, this.#query.countOnly, this.#query.description, this.#query.monitorCapacityConsumed, this.#query.exclusiveStartKey);

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
		this.#query = new Query(this.#query.table, this.#query.index, this.#query.keyFilter, this.#query.resultsFilter, this.#query.parallelFilter, this.#query.attributes, this.#query.limit, this.#query.orderingType, this.#query.consistentRead, true, this.#query.countOnly, this.#query.description, this.#query.monitorCapacityConsumed, this.#query.exclusiveStartKey);

		return this;
	}

	/**
	 * Adds a directive to return a record count, instead of the records themselves.
	 *
	 * @public
	 * @returns {QueryBuilder}
	 */
	withCount() {
		this.#query = new Query(this.#query.table, this.#query.index, this.#query.keyFilter, this.#query.resultsFilter, this.#query.parallelFilter, this.#query.attributes, this.#query.limit, this.#query.orderingType, this.#query.consistentRead, this.#query.skipDeserialization, true, this.#query.description, this.#query.monitorCapacityConsumed, this.#query.exclusiveStartKey);

		return this;
	}

	/**
	 * Adds a directive to track RCU (read capacity units) consumed by the query's execution;
	 *
	 * @public
	 * @returns {QueryBuilder}
	 */
	withCapacityMonitored() {
		this.#query = new Query(this.#query.table, this.#query.index, this.#query.keyFilter, this.#query.resultsFilter, this.#query.parallelFilter, this.#query.attributes, this.#query.limit, this.#query.orderingType, this.#query.consistentRead, this.#query.skipDeserialization, this.#query.countOnly, this.#query.description, true, this.#query.exclusiveStartKey);

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

        this.#query = new Query(this.#query.table, this.#query.index, this.#query.keyFilter, this.#query.resultsFilter, this.#query.parallelFilter, this.#query.attributes, this.#query.limit, this.#query.orderingType, this.#query.consistentRead, this.#query.skipDeserialization, this.#query.countOnly, this.#query.description, this.#query.monitorCapacityConsumed, exclusiveStartKey);

        return this;
    }

	/**
	 * Spawns an array of {@link Query} instances, each having the same properties
	 * as the current {@link QueryBuilder}. However, each query is modified to return
	 * a subset of results by adding additional filters to the range key, according
	 * to instructions provided by the range extractor function.
	 *
	 * @public
	 * @param {RangeExtractor} rangeExtractor
	 * @returns {Query[]}
	 */
	toParallelQueries(rangeExtractor) {
		assert.argumentIsRequired(rangeExtractor, 'rangeExtractor', Function);

		if (this.query.countOnly) {
			throw new Error('Count queries cannot be run in parallel.');
		}

		const table = this.#query.table;

		let rangeKey;

		if (this.#query.index === null) {
			rangeKey = table.rangeKey;
		} else {
			const keys = this.#query.index.keys;

			rangeKey = keys.find(k => k.keyType === KeyType.RANGE) || null;
		}

		if (rangeKey === null) {
			throw new Error('Unable to use parallelism on a table without a range key.');
		}

		const ranges = rangeExtractor(table);

		if (this.#query.orderingType === OrderingType.DESCENDING) {
			ranges.reverse();
		}

		return ranges.map((range, i) => {
			const start = range.start;
			const end = range.end;

			let expression;

			if (!is.nil(end) && !is.undef(end)) {
				expression = new Expression(rangeKey.attribute, OperatorType.BETWEEN, [ start, end ]);
			} else {
				expression = new Expression(rangeKey.attribute, OperatorType.GREATER_THAN_OR_EQUAL_TO, start);
			}

			const parallelFilter = new Filter([ expression ]);

			return new Query(this.#query.table, this.#query.index, this.#query.keyFilter, this.#query.resultsFilter, parallelFilter, this.#query.attributes, this.#query.limit, this.#query.orderingType, this.#query.consistentRead, this.#query.skipDeserialization, false, `${this.#query.description} [ ${i} ]`, this.#query.monitorCapacityConsumed);
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

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
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
 * Describes a range boundary used to partition a query.
 *
 * @typedef {object} Range
 * @property {*} start
 * @property {*|null|undefined} end
 */

/**
 * A callback that provides the consumer with an {@link AttributeBuilder}
 *
 * @public
 * @callback RangeExtractor
 * @param {Table} table
 * @returns {Range[]}
 */
