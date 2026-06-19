import * as is from '@barchart/common-js/lang/is.js';
import * as object from '@barchart/common-js/lang/object.js';

import Action from './Action.js';
import Filter from './Filter.js';
import Index from './../../schema/definitions/Index.js';
import KeyType from './../../schema/definitions/KeyType.js';
import OrderingType from './OrderingType.js';
import Table from './../../schema/definitions/Table.js';

/**
 * @typedef {import('../../schema/definitions/Attribute.js').default} Attribute
 */

/**
 * The definition of a table (or index) query.
 *
 * @public
 * @extends {Action}
 */
export default class Query extends Action {
	#attributes;
	#consistentRead;
	#countOnly;
	#exclusiveStartKey;
	#keyFilter;
	#limit;
	#monitorCapacityConsumed;
	#orderingType;
	#parallelFilter;
	#resultsFilter;
	#skipDeserialization;

	/**
	 * @param {Table} table
	 * @param {Index=} index
	 * @param {Filter=} keyFilter
	 * @param {Filter=} resultsFilter
	 * @param {Filter=} parallelFilter
	 * @param {Array<Attribute>=} attributes
	 * @param {number=} limit
	 * @param {OrderingType=} orderingType
	 * @param {boolean=} consistentRead
	 * @param {boolean=} skipDeserialization
	 * @param {boolean=} countOnly
	 * @param {string=} description
	 * @param {boolean=} monitorCapacityConsumed
	 * @param {object=} exclusiveStartKey
	 */
	constructor(table, index, keyFilter, resultsFilter, parallelFilter, attributes, limit, orderingType, consistentRead, skipDeserialization, countOnly, description, monitorCapacityConsumed, exclusiveStartKey) {
		super(table, index, (description || '[Unnamed Query]'));

		this.#keyFilter = keyFilter || null;
		this.#resultsFilter = resultsFilter || null;
		this.#parallelFilter = parallelFilter || null;

		this.#attributes = attributes || [ ];
		this.#limit = limit || null;
		this.#consistentRead = consistentRead || false;
		this.#skipDeserialization = skipDeserialization || false;
		this.#countOnly = countOnly || false;
		this.#monitorCapacityConsumed = monitorCapacityConsumed || false;

		this.#orderingType = orderingType || OrderingType.ASCENDING;

        this.#exclusiveStartKey = exclusiveStartKey || null;
	}

	/**
	 * A {@link Filter} to apply to key of the table (or index).
	 *
	 * @public
	 * @returns {Filter}
	 */
	get keyFilter() {
		return this.#keyFilter;
	}

	/**
	 * A {@link Filter} to apply to results of the query (after the
	 * PartitionTransformer has been applied).
	 *
	 * @public
	 * @returns {Filter}
	 */
	get resultsFilter() {
		return this.#resultsFilter;
	}

	/**
	 * A {@link Filter} to applied to the range key of the table (which is added to
	 * the existing PartitionTransformer). This filter is used to split the query into a smaller
	 * set -- based on range key.
	 *
	 * @public
	 * @returns {Filter}
	 */
	get parallelFilter() {
		return this.#parallelFilter;
	}

	/**
	 * The {@link Attribute} instances to select. If the array is empty, all
	 * attributes will be selected.
	 *
	 * @public
	 * @returns {Attribute[]}
	 */
	get attributes() {
		return [...this.#attributes];
	}

	/**
	 * The maximum number of results to returns from the query. A null value
	 * will be interpreted as no limit.
	 *
	 * @public
	 * @returns {number|null}
	 */
	get limit() {
		return this.#limit;
	}

	/**
	 * The desired order of the results.
	 *
	 * @public
	 * @returns {OrderingType}
	 */
	get orderingType() {
		return this.#orderingType;
	}

	/**
	 * If true, a consistent read will be used.
	 *
	 * @public
	 * @returns {boolean}
	 */
	get consistentRead() {
		return this.#consistentRead;
	}

	/**
	 * If true, the query will return records in DynamoDB format, skipping
	 * the conversion to normal objects.
	 *
	 * @public
	 * @returns {boolean}
	 */
	get skipDeserialization() {
		return this.#skipDeserialization;
	}

	/**
	 * If true, the query will return a record count only.
	 *
	 * @public
	 * @returns {boolean}
	 */
	get countOnly() {
		return this.#countOnly;
	}

	/**
	 * If true, the total RCU (read capacity units) consumed will be monitored.
	 *
	 * @public
	 * @returns {boolean}
	 */
	get monitorCapacityConsumed() {
		return this.#monitorCapacityConsumed;
	}

    /**
     * The key from which to start querying. Used for paginating results in DynamoDB.
     * If provided, the query will begin just after this key.
     *
     * @public
     * @returns {object}
     */
    get exclusiveStartKey(){
        return this.#exclusiveStartKey;
    }

	/**
	 * Throws an {@link Error} if the instance is invalid.
	 *
	 * @public
	 */
	validate() {
		if (!(this.table instanceof Table)) {
			throw new Error('Table data type is invalid.');
		}

		if (this.index !== null && !(this.index instanceof Index)) {
			throw new Error('Index data type is invalid.');
		}

		if (this.index !== null && !this.table.indices.some(i => i.equals(this.index, true))) {
			throw new Error('The index must belong to the table.');
		}

		if (this.index !== null && this.#consistentRead && !this.index.type.allowsConsistentReads) {
			throw new Error('Unable to apply consistent read to index.');
		}

		if (!(this.#keyFilter instanceof Filter)) {
			throw new Error('The key filter data type is invalid.');
		}

		this.#keyFilter.validate();

		let keys;

		if (this.index === null) {
			keys = this.table.keys;
		} else {
			keys = this.index.keys;
		}

		if (this.#keyFilter.expressions.filter(e => e.attribute.name === (keys.find(k => k.keyType === KeyType.HASH)).attribute.name).length !== 1) {
			throw new Error('The key filter must reference the hash key.');
		}

		if (this.#resultsFilter !== null) {
			if (!(this.#resultsFilter instanceof Filter)) {
				throw new Error('The results filter data type is invalid.');
			}

			this.#resultsFilter.validate();
		}

		if (this.#parallelFilter !== null) {
			if (!(this.#parallelFilter instanceof Filter)) {
				throw new Error('The parallel filter data type is invalid.');
			}

			if (this.#parallelFilter.expressions.filter(e => e.attribute.name === (keys.find(k => k.keyType === KeyType.RANGE)).attribute.name).length !== 1) {
				throw new Error('The key parallel must reference the range key.');
			}
		}

		if (!(this.#orderingType instanceof OrderingType)) {
			throw new Error('The ordering type is invalid.');
		}

		if (this.#limit !== null && (!is.large(this.#limit) || !(this.#limit > 0))) {
			throw new Error('The limit must be a positive integer.');
		}
	}

	/**
	 * Outputs an object suitable for running a "query" operation using
	 * the DynamoDB SDK.
	 *
	 * @public
	 * @returns {object}
	 */
	toQuerySchema() {
		this.validate();

		const schema = {
			TableName: this.table.name
		};

		if (this.index !== null) {
			schema.IndexName = this.index.name;
		}

		let attributes = this.attributes;

		if (attributes.length !== 0) {
			schema.Select = 'SPECIFIC_ATTRIBUTES';
			schema.ProjectionExpression = Action.getProjectionExpression(this.table, attributes);
		} else if (this.countOnly) {
			schema.Select = 'COUNT';
		}

		let keyFilterToUse;

		if (this.#parallelFilter === null) {
			keyFilterToUse = this.#keyFilter;
		} else {
			keyFilterToUse = Filter.merge(this.#keyFilter, this.#parallelFilter);
		}

		const keyExpressionData = Action.getConditionExpressionData(this.table, keyFilterToUse);

		schema.KeyConditionExpression = keyExpressionData.expression;
		attributes = attributes.concat(keyFilterToUse.expressions.map(e => e.attribute));

		let valueAliases = keyExpressionData.valueAliases;

		if (this.#resultsFilter !== null) {
			const resultsExpressionData = Action.getConditionExpressionData(this.table, this.#resultsFilter, keyExpressionData.offset);

			schema.FilterExpression = resultsExpressionData.expression;
			attributes = attributes.concat(this.#resultsFilter.expressions.map(e => e.attribute));

			valueAliases = object.merge(keyExpressionData.valueAliases, resultsExpressionData.valueAliases);
		} else {
			valueAliases = keyExpressionData.valueAliases;
		}

		if (attributes.length !== 0) {
			schema.ExpressionAttributeNames = Action.getExpressionAttributeNames(this.table, attributes);
		}

		schema.ExpressionAttributeValues = valueAliases;
		schema.ScanIndexForward = this.#orderingType.forward;

		if (this.#limit !== null) {
			schema.Limit = this.#limit;
		}

		if (this.#consistentRead) {
			schema.ConsistentRead = true;
		}

		if (this.#monitorCapacityConsumed) {
			schema.ReturnConsumedCapacity = 'TOTAL';
		}

        if (this.#exclusiveStartKey) {
            schema.ExclusiveStartKey = this.#exclusiveStartKey;
        }

		return schema;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[Query]';
	}
}
