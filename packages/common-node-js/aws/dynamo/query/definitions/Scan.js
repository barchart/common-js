import * as is from '@barchart/common-js/lang/is.js';
import * as object from '@barchart/common-js/lang/object.js';

import Action from './Action.js';
import Filter from './Filter.js';
import Index from './../../schema/definitions/Index.js';
import Table from './../../schema/definitions/Table.js';

/**
 * @typedef {import('../../schema/definitions/Attribute.js').default} Attribute
 */

/**
 * The definition of a table (or index) scan.
 *
 * @public
 * @extends {Action}
 */
export default class Scan extends Action {
	#attributes;
	#consistentRead;
	#countOnly;
	#exclusiveStartKey;
	#filter;
	#limit;
	#monitorCapacityConsumed;
	#segment;
	#skipDeserialization;
	#totalSegments;

	/**
	 * @param {Table} table - The table.
	 * @param {Index=} index - The index.
	 * @param {Filter=} filter - The filter.
	 * @param {Array<Attribute>=} attributes - The attributes.
	 * @param {number=} limit - The limit.
	 * @param {number=} segment - The segment.
	 * @param {number=} totalSegments - The total segments.
	 * @param {boolean=} consistentRead - The consistent read.
	 * @param {boolean=} skipDeserialization - The skip deserialization.
	 * @param {boolean=} countOnly - The count only.
	 * @param {string=} description - The description.
	 * @param {boolean=} monitorCapacityConsumed - The monitor capacity consumed.
	 * @param {object=} exclusiveStartKey - The exclusive start key.
	 */
	constructor(table, index, filter, attributes, limit, segment, totalSegments, consistentRead, skipDeserialization, countOnly, description, monitorCapacityConsumed, exclusiveStartKey) {
		super(table, index, (description || '[Unnamed Scan]'));

		this.#filter = filter || null;
		this.#attributes = attributes || [ ];
		this.#limit = limit || null;
		this.#segment = is.number(segment) ? segment : null;
		this.#totalSegments = is.number(totalSegments) ? totalSegments : null;
		this.#skipDeserialization = skipDeserialization || false;
		this.#consistentRead = consistentRead || false;
		this.#countOnly = countOnly || false;
		this.#monitorCapacityConsumed = monitorCapacityConsumed || false;
        this.#exclusiveStartKey = exclusiveStartKey || null;
	}

	/**
	 * A {@link Filter} to apply results scan.
	 *
	 * @public
	 * @returns {Filter}
	 */
	get filter() {
		return this.#filter;
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
	 * The maximum number of results to returns from the scan. A null value
	 * will be interpreted as no limit.
	 *
	 * @public
	 * @returns {number|null}
	 */
	get limit() {
		return this.#limit;
	}

	/**
	 * Identifies an individual segment to be scanned by an AWS DynamoDB worker.
	 *
	 * @public
	 * @returns {number|null}
	 */
	get segment() {
		return this.#segment;
	}

	/**
	 * The total number of segments into which the Scan operation will be divided.
	 *
	 * @public
	 * @returns {number|null}
	 */
	get totalSegments() {
		return this.#totalSegments;
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
	 * If true, the scan will return records in DynamoDB format, skipping
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
     * The key from which to start scanning. Used for paginating results in DynamoDB.
     * If provided, the scan will begin just after this key.
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

		if (this.#filter !== null) {
			if (!(this.#filter instanceof Filter)) {
				throw new Error('Filter data type is invalid.');
			}

			this.#filter.validate();
		}

		if (this.#limit !== null && (!is.large(this.#limit) || !(this.#limit > 0))) {
			throw new Error('The limit must be a positive integer.');
		}

		if ((this.#segment !== null) !== (this.#totalSegments !== null)) {
			throw new Error('Parallel queries must supply both the target segment and total segments.');
		}

		if (this.#totalSegments !== null && !(is.integer(this.#totalSegments) && is.positive(this.#totalSegments))) {
			throw new Error('Parallel queries must use a positive integer value for total segments.');
		}

		if (this.#segment !== null && !(is.integer(this.#segment) && !is.negative(this.#segment))) {
			throw new Error('Parallel queries cannot have a target segment with a negative value');
		}

		if (this.#segment !== null && !(this.#segment < this.#totalSegments)) {
			throw new Error('Parallel queries must use use a target segment value less than the total segments');
		}
	}

	/**
	 * Outputs an object suitable for running a "scan" operation using
	 * the DynamoDB SDK.
	 *
	 * @public
	 * @returns {object}
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

		if (this.#filter !== null) {
			const expressionData = Action.getConditionExpressionData(this.table, this.#filter);

			schema.FilterExpression = expressionData.expression;

			if (object.keys(expressionData.valueAliases).length !== 0) {
				schema.ExpressionAttributeValues = expressionData.valueAliases;
			}

			attributes = attributes.concat(this.#filter.expressions.map(e => e.attribute));
		}

		if (attributes.length !== 0) {
			schema.ExpressionAttributeNames = Action.getExpressionAttributeNames(this.table, attributes);
		}

		if (this.#limit !== null) {
			schema.Limit = this.#limit;
		}

		if (this.#segment !== null && this.#totalSegments !== null) {
			schema.Segment = this.#segment;
			schema.TotalSegments = this.#totalSegments;
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
		return '[Scan]';
	}
}
