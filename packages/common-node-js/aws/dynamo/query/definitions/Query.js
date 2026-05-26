const is = require('@barchart/common-js/lang/is'),
	object = require('@barchart/common-js/lang/object');

const Action = require('./Action'),
	Filter = require('./Filter'),
	Index = require('./../../schema/definitions/Index'),
	KeyType = require('./../../schema/definitions/KeyType'),
	OrderingType = require('./OrderingType'),
	Table = require('./../../schema/definitions/Table');

module.exports = (() => {
	'use strict';

	/**
	 * The definition of a table (or index) query.
	 *
	 * @public
	 * @extends {Action}
	 * @param {Table} table
	 * @param {Index} index
	 * @param {Filter} keyFilter
	 * @param {Filter} resultsFilter
	 * @param {Array<Attribute>} attributes
	 * @param {OrderingType=} orderingType
	 * @param {Boolean=} consistentRead
	 * @param {Boolean=} skipDeserialization
	 * @param {Boolean=} countOnly
	 * @param {String=} description
	 * @param {Boolean=} monitorCapacityConsumed
     * @param {Object=} exclusiveStartKey
	 */
	class Query extends Action {
		constructor(table, index, keyFilter, resultsFilter, parallelFilter, attributes, limit, orderingType, consistentRead, skipDeserialization, countOnly, description, monitorCapacityConsumed, exclusiveStartKey) {
			super(table, index, (description || '[Unnamed Query]'));

			this._keyFilter = keyFilter || null;
			this._resultsFilter = resultsFilter || null;
			this._parallelFilter = parallelFilter || null;

			this._attributes = attributes || [ ];
			this._limit = limit || null;
			this._consistentRead = consistentRead || false;
			this._skipDeserialization = skipDeserialization || false;
			this._countOnly = countOnly || false;
			this._monitorCapacityConsumed = monitorCapacityConsumed || false;

			this._orderingType = orderingType || OrderingType.ASCENDING;

            this._exclusiveStartKey = exclusiveStartKey || null;
		}

		/**
		 * A {@link Filter} to apply to key of the table (or index).
		 *
		 * @public
		 * @returns {Filter}
		 */
		get keyFilter() {
			return this._keyFilter;
		}

		/**
		 * A {@link Filter} to apply to results of the query (after the
		 * PartitionTransformer has been applied).
		 *
		 * @public
		 * @returns {Filter}
		 */
		get resultsFilter() {
			return this._resultsFilter;
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
			return this._parallelFilter;
		}

		/**
		 * The {@link Attribute} instances to select. If the array is empty, all
		 * attributes will be selected.
		 *
		 * @public
		 * @returns {Attribute[]}
		 */
		get attributes() {
			return [...this._attributes];
		}

		/**
		 * The maximum number of results to returns from the query. A null value
		 * will be interpreted as no limit.
		 *
		 * @public
		 * @returns {Number|null}
		 */
		get limit() {
			return this._limit;
		}

		/**
		 * The desired order of the results.
		 *
		 * @public
		 * @returns {OrderingType}
		 */
		get orderingType() {
			return this._orderingType;
		}

		/**
		 * If true, a consistent read will be used.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get consistentRead() {
			return this._consistentRead;
		}

		/**
		 * If true, the query will return records in DynamoDB format, skipping
		 * the conversion to normal objects.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get skipDeserialization() {
			return this._skipDeserialization;
		}

		/**
		 * If true, the query will return a record count only.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get countOnly() {
			return this._countOnly;
		}

		/**
		 * If true, the total RCU (read capacity units) consumed will be monitored.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get monitorCapacityConsumed() {
			return this._monitorCapacityConsumed;
		}

        /**
         * The key from which to start querying. Used for paginating results in DynamoDB.
         * If provided, the query will begin just after this key.
         *
         * @public
         * @returns {Object}
         */
        get exclusiveStartKey(){
            return this._exclusiveStartKey;
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

			if (this._index !== null && this._consistentRead && !this._index.type.allowsConsistentReads) {
				throw new Error('Unable to apply consistent read to index.');
			}

			if (!(this._keyFilter instanceof Filter)) {
				throw new Error('The key filter data type is invalid.');
			}

			this._keyFilter.validate();

			let keys;

			if (this.index === null) {
				keys = this.table.keys;
			} else {
				keys = this.index.keys;
			}

			if (this._keyFilter.expressions.filter(e => e.attribute.name === (keys.find(k => k.keyType === KeyType.HASH)).attribute.name).length !== 1) {
				throw new Error('The key filter must reference the hash key.');
			}

			if (this._resultsFilter !== null) {
				if (!(this._resultsFilter instanceof Filter)) {
					throw new Error('The results filter data type is invalid.');
				}

				this._resultsFilter.validate();
			}

			if (this._parallelFilter !== null) {
				if (!(this._parallelFilter instanceof Filter)) {
					throw new Error('The parallel filter data type is invalid.');
				}

				if (this._parallelFilter.expressions.filter(e => e.attribute.name === (keys.find(k => k.keyType === KeyType.RANGE)).attribute.name).length !== 1) {
					throw new Error('The key parallel must reference the range key.');
				}
			}

			if (!(this._orderingType instanceof OrderingType)) {
				throw new Error('The ordering type is invalid.');
			}

			if (this._limit !== null && (!is.large(this._limit) || !(this._limit > 0))) {
				throw new Error('The limit must be a positive integer.');
			}
		}

		/**
		 * Outputs an object suitable for running a "query" operation using
		 * the DynamoDB SDK.
		 *
		 * @public
		 * @returns {Object}
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

			if (this._parallelFilter === null) {
				keyFilterToUse = this._keyFilter;
			} else {
				keyFilterToUse = Filter.merge(this._keyFilter, this._parallelFilter);
			}

			const keyExpressionData = Action.getConditionExpressionData(this.table, keyFilterToUse);

			schema.KeyConditionExpression = keyExpressionData.expression;
			attributes = attributes.concat(keyFilterToUse.expressions.map(e => e.attribute));

			let valueAliases = keyExpressionData.valueAliases;

			if (this._resultsFilter !== null) {
				const resultsExpressionData = Action.getConditionExpressionData(this.table, this._resultsFilter, keyExpressionData.offset);

				schema.FilterExpression = resultsExpressionData.expression;
				attributes = attributes.concat(this._resultsFilter.expressions.map(e => e.attribute));

				valueAliases = object.merge(keyExpressionData.valueAliases, resultsExpressionData.valueAliases);
			} else {
				valueAliases = keyExpressionData.valueAliases;
			}

			if (attributes.length !== 0) {
				schema.ExpressionAttributeNames = Action.getExpressionAttributeNames(this._table, attributes);
			}

			schema.ExpressionAttributeValues = valueAliases;
			schema.ScanIndexForward = this._orderingType.forward;

			if (this._limit !== null) {
				schema.Limit = this._limit;
			}

			if (this._consistentRead) {
				schema.ConsistentRead = true;
			}

			if (this._monitorCapacityConsumed) {
				schema.ReturnConsumedCapacity = 'TOTAL';
			}

            if (this._exclusiveStartKey) {
                schema.ExclusiveStartKey = this._exclusiveStartKey;
            }

			return schema;
		}

		toString() {
			return '[Query]';
		}
	}

	return Query;
})();
