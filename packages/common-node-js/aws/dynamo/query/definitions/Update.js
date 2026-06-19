import * as array from '@barchart/common-js/lang/array.js';
import * as object from '@barchart/common-js/lang/object.js';

import Action from './Action.js';
import Filter from './Filter.js';
import KeyType from './../../schema/definitions/KeyType.js';
import OperatorType from './OperatorType.js';
import Serializers from './../../../dynamo/schema/serialization/Serializers.js';
import Table from './../../schema/definitions/Table.js';
import UpdateActionType from './UpdateActionType.js';

/**
 * @typedef {import('@barchart/common-js/lang/Enum.js').default} Enum
 * @typedef {import('./UpdateExpression.js').default} UpdateExpression
 * @typedef {import('./ReturnValueType.js').default} ReturnValueType
 */

/**
 * The definition of an update action.
 *
 * @public
 * @extends {Action}
 */
export default class Update extends Action {
	#conditionFilter;
	#expressions;
	#keyFilter;
	#returnType;

	/**
	 * @param {Table} table
	 * @param {Filter=} keyFilter
	 * @param {Filter=} conditionFilter
	 * @param {UpdateExpression[]=} expressions
	 * @param {ReturnValueType=} returnType
	 * @param {string=} description
	 */
	constructor(table, keyFilter, conditionFilter, expressions, returnType, description) {
		super(table, null, (description || '[Unnamed Update]'));

		this.#keyFilter = keyFilter || null;
		this.#conditionFilter = conditionFilter || null;
		this.#expressions = expressions || [ ];
		this.#returnType = returnType || null;
	}

	/**
	 * A {@link Filter} to apply to key of the table.
	 *
	 * @public
	 * @returns {Filter}
	 */
	get keyFilter() {
		return this.#keyFilter;
	}

	/**
	 * An optional {@link Filter} to apply condition expression. This allows to write
	 * to proceed only if the condition expressions succeed.
	 *
	 * @public
	 * @returns {Filter|null}
	 */
	get conditionFilter() {
		return this.#conditionFilter;
	}

	/**
	 * An array of update actions to process.
	 *
	 * @public
	 * @returns {Array<UpdateExpression>}
	 */
	get expressions() {
		return this.#expressions;
	}

	/**
	 * A {@link ReturnValueType} specifies returning values of update.
	 *
	 * @public
	 * @returns {ReturnValueType}
	 */
	get returnType() {
		return this.#returnType;
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

		if (!(this.#keyFilter instanceof Filter)) {
			throw new Error('The key filter data type is invalid.');
		}

		this.#keyFilter.validate();

		if (this.#keyFilter.expressions.filter(e => e.attribute.name === (this.table.keys.find(k => k.keyType === KeyType.HASH)).attribute.name).length !== 1) {
			throw new Error('The key filter must reference the hash key.');
		}

		const rangeKey = this.table.keys.find(k => k.keyType === KeyType.RANGE);

		if (rangeKey) {
			if (this.#keyFilter.expressions.filter(e => e.attribute.name === rangeKey.attribute.name).length !== 1) {
				throw new Error('The key filter must reference the range key.');
			}
		}

		if (this.#keyFilter.expressions.filter(e => e.operatorType !== OperatorType.EQUALS).length > 0) {
			throw new Error('The key filter must have only equals operators.');
		}

		if (this.#expressions.length === 0) {
			throw new Error('Must have at least one update expression.');
		}

		this.#expressions.forEach(e => e.validate());
	}

	/**
	 * Outputs an object suitable for running an "update" operation using
	 * the DynamoDB SDK.
	 *
	 * @public
	 * @returns {object}
	 */
	toUpdateSchema() {
		this.validate();

		const schema = {
			TableName: this.table.name
		};

		schema.Key = this.#keyFilter.expressions.reduce((acc, e) => {
			acc[e.attribute.name] = Serializers.forDataType(e.attribute.dataType).serialize(e.operand);

			return acc;
		}, { });

		const expression = { };

		expression.attributeAliases = { };
		expression.filter = new Filter([ ]);
		expression.offset = 0;

		if (this.#conditionFilter !== null) {
			const conditionExpressionData = Action.getConditionExpressionData(this.table, this.#conditionFilter, expression.offset);

			expression.attributeAliases = object.merge(expression.attributeAliases, conditionExpressionData.valueAliases);
			expression.filter = Filter.merge(expression.filter, this.#conditionFilter);
			expression.offset = conditionExpressionData.offset;

			schema.ConditionExpression = conditionExpressionData.expression;
		}

		const expressionsByAction = array.groupBy(this.#expressions, e => e.actionType.code);

		const updateExpressions = Object.keys(expressionsByAction).map((key) => {
			const actionType = UpdateActionType.parse(key);

			const expressions = expressionsByAction[key];
			const updateExpressionData = Action.getConditionExpressionData(this.table, new Filter(expressions), expression.offset);

			expression.attributeAliases = object.merge(expression.attributeAliases, updateExpressionData.valueAliases);
			expression.filter = Filter.merge(expression.filter, new Filter(expressions));
			expression.offset = updateExpressionData.offset;

			return `${actionType.keyword} ${updateExpressionData.expressionComponents.join(',')}`;
		});

		schema.ExpressionAttributeValues = expression.attributeAliases;
		schema.ExpressionAttributeNames = Action.getExpressionAttributeNames(this.table, expression.filter.expressions.map(e => e.attribute));
		schema.UpdateExpression = updateExpressions.join(' ');

		if (this.#returnType) {
			schema.ReturnValues = this.#returnType.keyword;
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
		return '[Update]';
	}
}
