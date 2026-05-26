const array = require('@barchart/common-js/lang/array'),
	Enum = require('@barchart/common-js/lang/Enum'),
	object = require('@barchart/common-js/lang/object');

const Action = require('./Action'),
	Filter = require('./Filter'),
	KeyType = require('./../../schema/definitions/KeyType'),
	OperatorType = require('./OperatorType'),
	ReturnValueType = require('./ReturnValueType'),
	Serializers = require('./../../../dynamo/schema/serialization/Serializers'),
	Table = require('./../../schema/definitions/Table'),
	UpdateActionType = require('./UpdateActionType');

module.exports = (() => {
	'use strict';

	/**
	 * The definition of an update action.
	 *
	 * @public
	 * @extends {Action}
	 * @param {Table} table
	 * @param {Filter} keyFilter
	 * @param {Filter} conditionFilter
	 * @param {UpdateExpression[]} expressions
	 * @param {ReturnValueType} returnType
	 * @param {String=} description
	 */
	class Update extends Action {
		constructor(table, keyFilter, conditionFilter, expressions, returnType, description) {
			super(table, null, (description || '[Unnamed Update]'));

			this._keyFilter = keyFilter || null;
			this._conditionFilter = conditionFilter || null;
			this._expressions = expressions || [ ];
			this._returnType = returnType || null;
		}

		/**
		 * A {@link Filter} to apply to key of the table.
		 *
		 * @public
		 * @returns {Filter}
		 */
		get keyFilter() {
			return this._keyFilter;
		}

		/**
		 * An optional {@link Filter} to apply condition expression. This allows write
		 * to proceed only if the condition expressions succeed.
		 *
		 * @public
		 * @returns {Filter|null}
		 */
		get conditionFilter() {
			return this._conditionFilter;
		}

		/**
		 * An array of update actions to process.
		 *
		 * @public
		 * @returns {Array<UpdateExpression>}
		 */
		get expressions() {
			return this._expressions;
		}

		/**
		 * A {@link ReturnValueType} specifies returning values of update.
		 *
		 * @public
		 * @returns {ReturnValueType}
		 */
		get returnType() {
			return this._returnType;
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

			if (!(this._keyFilter instanceof Filter)) {
				throw new Error('The key filter data type is invalid.');
			}

			this._keyFilter.validate();

			if (this._keyFilter.expressions.filter(e => e.attribute.name === (this.table.keys.find(k => k.keyType === KeyType.HASH)).attribute.name).length !== 1) {
				throw new Error('The key filter must reference the hash key.');
			}

			const rangeKey = this.table.keys.find(k => k.keyType === KeyType.RANGE);

			if (rangeKey) {
				if (this._keyFilter.expressions.filter(e => e.attribute.name === rangeKey.attribute.name).length !== 1) {
					throw new Error('The key filter must reference the range key.');
				}
			}

			if (this._keyFilter.expressions.filter(e => e.operatorType !== OperatorType.EQUALS).length > 0) {
				throw new Error('The key filter must have only equals operators.');
			}

			if (this._expressions.length === 0) {
				throw new Error('Must have at least one update expression.');
			}

			this._expressions.forEach(e => e.validate());
		}

		/**
		 * Outputs an object suitable for running an "update" operation using
		 * the DynamoDB SDK.
		 *
		 * @public
		 * @returns {Object}
		 */
		toUpdateSchema() {
			this.validate();

			const schema = {
				TableName: this._table.name
			};

			schema.Key = this._keyFilter.expressions.reduce((acc, e) => {
				acc[e.attribute.name] = Serializers.forDataType(e.attribute.dataType).serialize(e.operand);

				return acc;
			}, { });

			const expression = { };

			expression.attributeAliases = { };
			expression.filter = new Filter([ ]);
			expression.offset = 0;

			if (this._conditionFilter !== null) {
				const conditionExpressionData = Action.getConditionExpressionData(this._table, this._conditionFilter, expression.offset);

				expression.attributeAliases = object.merge(expression.attributeAliases, conditionExpressionData.valueAliases);
				expression.filter = Filter.merge(expression.filter, this._conditionFilter);
				expression.offset = conditionExpressionData.offset;

				schema.ConditionExpression = conditionExpressionData.expression;
			}

			const expressionsByAction = array.groupBy(this._expressions, e => e.actionType.code);

			const updateExpressions = Object.keys(expressionsByAction).map((key) => {
				const actionType = Enum.fromCode(UpdateActionType, key);

				const expressions = expressionsByAction[key];
				const updateExpressionData = Action.getConditionExpressionData(this._table, new Filter(expressions), expression.offset);

				expression.attributeAliases = object.merge(expression.attributeAliases, updateExpressionData.valueAliases);
				expression.filter = Filter.merge(expression.filter, new Filter(expressions));
				expression.offset = updateExpressionData.offset;

				return `${actionType.keyword} ${updateExpressionData.expressionComponents.join(',')}`;
			});

			schema.ExpressionAttributeValues = expression.attributeAliases;
			schema.ExpressionAttributeNames = Action.getExpressionAttributeNames(this._table, expression.filter.expressions.map(e => e.attribute));
			schema.UpdateExpression = updateExpressions.join(' ');

			if (this._returnType) {
				schema.ReturnValues = this._returnType.keyword;
			}

			return schema;
		}

		toString() {
			return '[Update]';
		}
	}

	return Update;
})();
