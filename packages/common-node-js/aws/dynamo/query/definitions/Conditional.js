import * as object from '@barchart/common-js/lang/object.js';

import Action from './Action.js';
import Filter from './Filter.js';
import Table from './../../schema/definitions/Table.js';

/**
 * A set of instructions for conditional updates, inserts, or
 * deletes.
 *
 * @public
 * @extends {Action}
 */
export default class Conditional extends Action {
	#filter;

	/**
	 * @param {Table} table - The table.
	 * @param {Filter=} filter - The filter.
	 * @param {string=} description - The description.
	 */
	constructor(table, filter, description) {
		super(table, null, (description || '[Unnamed Conditional]'));

		this.#filter = filter || null;
	}

	/**
	 * The conditional {@link Filter} (i.e. the collection of conditional
	 * {@link Expression} instances).
	 *
	 * @public
	 * @returns {Filter}
	 */
	get filter() {
		return this.#filter;
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

		if (!(this.#filter instanceof Filter)) {
			throw new Error('Filter data type is invalid.');
		}

		this.#filter.validate();
	}

	/**
	 * Outputs an object suitable for running a "conditional" operation
	 * using the DynamoDB SDK. Please note, the object may be incomplete
	 * (e.g. an "Item" property is needed to call the AWS "putItem" function).
	 *
	 * @public
	 * @returns {object}
	 */
	toConditionalSchema() {
		this.validate();

		const schema = {
			TableName: this.table.name
		};

		const expressionData = Action.getConditionExpressionData(this.table, this.#filter);

		schema.ConditionExpression = expressionData.expression;

		if (object.keys(expressionData.valueAliases).length !== 0) {
			schema.ExpressionAttributeValues = expressionData.valueAliases;
		}

		const attributes = this.#filter.expressions.map(e => e.attribute);

		if (attributes.length !== 0) {
			schema.ExpressionAttributeNames = Action.getExpressionAttributeNames(this.table, attributes);
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
		return '[Conditional]';
	}
}
