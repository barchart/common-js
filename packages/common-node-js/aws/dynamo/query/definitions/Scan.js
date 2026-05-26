const is = require('@barchart/common-js/lang/is'),
	object = require('@barchart/common-js/lang/object');

const Action = require('./Action'),
	Filter = require('./Filter'),
	Index = require('./../../schema/definitions/Index'),
	Table = require('./../../schema/definitions/Table');

module.exports = (() => {
	'use strict';

	/**
	 * The definition of a table (or index) scan.
	 *
	 * @public
	 * @extends {Action}
	 * @param {Table} table
	 * @param {Index} index
	 * @param {Filter} filter
	 * @param {Array<Attribute>} attributes
	 * @param {Number=} limit
	 * @param {Number=} segment
	 * @param {Number=} totalSegments
	 * @param {Boolean=} consistentRead
	 * @param {Boolean=} skipDeserialization
	 * @param {Boolean=} countOnly
	 * @param {String=} description
	 * @param {Boolean=} monitorCapacityConsumed
     * @param {Object=} exclusiveStartKey
	 */
	class Scan extends Action {
		constructor(table, index, filter, attributes, limit, segment, totalSegments, consistentRead, skipDeserialization, countOnly, description, monitorCapacityConsumed, exclusiveStartKey) {
			super(table, index, (description || '[Unnamed Scan]'));

			this._filter = filter || null;
			this._attributes = attributes || [ ];
			this._limit = limit || null;
			this._segment = is.number(segment) ? segment : null;
			this._totalSegments = is.number(totalSegments) ? totalSegments : null;
			this._skipDeserialization = skipDeserialization || false;
			this._consistentRead = consistentRead || false;
			this._countOnly = countOnly || false;
			this._monitorCapacityConsumed = monitorCapacityConsumed || false;
            this._exclusiveStartKey = exclusiveStartKey || null;
		}

		/**
		 * A {@link Filter} to apply results scan.
		 *
		 * @public
		 * @returns {Filter}
		 */
		get filter() {
			return this._filter;
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
		 * The maximum number of results to returns from the scan. A null value
		 * will be interpreted as no limit.
		 *
		 * @public
		 * @returns {Number|null}
		 */
		get limit() {
			return this._limit;
		}

		/**
		 * Identifies an individual segment to be scanned by an AWS DynamoDB worker.
		 *
		 * @public
		 * @return {Number|null}
		 */
		get segment() {
			return this._segment;
		}

		/**
		 * The total number of segments into which the Scan operation will be divided.
		 *
		 * @public
		 * @return {Number|null}
		 */
		get totalSegments() {
			return this._totalSegments;
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
		 * If true, the scan will return records in DynamoDB format, skipping
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
         * The key from which to start scanning. Used for paginating results in DynamoDB.
         * If provided, the scan will begin just after this key.
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

			if (this._filter !== null) {
				if (!(this._filter instanceof Filter)) {
					throw new Error('Filter data type is invalid.');
				}

				this._filter.validate();
			}

			if (this._limit !== null && (!is.large(this._limit) || !(this._limit > 0))) {
				throw new Error('The limit must be a positive integer.');
			}

			if ((this._segment !== null ^ this._totalSegments !== null) === 1) {
				throw new Error('Parallel queries must supply both the target segment and total segments.');
			}

			if (this._totalSegments !== null && !(is.integer(this._totalSegments) && is.positive(this._totalSegments))) {
				throw new Error('Parallel queries must use a positive integer value for total segments.');
			}

			if (this._segment !== null && !(is.integer(this._segment) && !is.negative(this._segment))) {
				throw new Error('Parallel queries cannot have a target segment with a negative value');
			}

			if (this._segment !== null && !(this._segment < this._totalSegments)) {
				throw new Error('Parallel queries must use use a target segment value less than the total segments');
			}
		}

		/**
		 * Outputs an object suitable for running a "scan" operation using
		 * the DynamoDB SDK.
		 *
		 * @public
		 * @returns {Object}
		 */
		toScanSchema() {
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

			if (this._filter !== null) {
				const expressionData = Action.getConditionExpressionData(this.table, this._filter);

				schema.FilterExpression = expressionData.expression;

				if (object.keys(expressionData.valueAliases).length !== 0) {
					schema.ExpressionAttributeValues = expressionData.valueAliases;
				}

				attributes = attributes.concat(this._filter.expressions.map(e => e.attribute));
			}

			if (attributes.length !== 0) {
				schema.ExpressionAttributeNames = Action.getExpressionAttributeNames(this._table, attributes);
			}

			if (this._limit !== null) {
				schema.Limit = this._limit;
			}

			if (this._segment !== null && this._totalSegments !== null) {
				schema.Segment = this._segment;
				schema.TotalSegments = this._totalSegments;
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
			return '[Scan]';
		}
	}

	return Scan;
})();
