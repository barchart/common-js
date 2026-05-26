const assert = require('@barchart/common-js/lang/assert');

const ReturnValueType = require('./../definitions/ReturnValueType'),
	Table = require('./../../schema/definitions/Table'),
	Update = require('./../definitions/Update'),
	UpdateActionType = require('./../definitions/UpdateActionType'),
	UpdateExpression = require('./../definitions/UpdateExpression'),
	UpdateOperatorType = require('./../definitions/UpdateOperatorType');

const ActionBuilder = require('./ActionBuilder'),
	FilterBuilder = require('./FilterBuilder');

module.exports = (() => {
	'use strict';

	/**
	 * Fluent interface for building an {@link Update}.
	 *
	 * @public
	 * @extends {ActionBuilder}
	 * @param {Table} table - The table targeted.
	 */
	class UpdateBuilder extends ActionBuilder {
		constructor(table) {
			super();

			this._update = new Update(table);
		}

		/**
		 * The {@link Action}, given all the information provided thus far.
		 *
		 * @public
		 * @returns {Action}
		 */
		get action() {
			return this._update;
		}

		/**
		 * The {@link Update}, given all the information provided thus far.
		 *
		 * @public
		 * @returns {Update}
		 */
		get update() {
			return this._update;
		}

		/**
		 * Adds a {@link Filter} targeting the table's key. Uses a callback
		 * to provides the consumer with a {@link FilterBuilder}.
		 *
		 * @public
		 * @param {Function} callback - Synchronously called, providing a {@link FilterBuilder} tied to the current instance.
		 * @returns {UpdateBuilder}
		 */
		withKeyFilterBuilder(callback) {
			assert.argumentIsRequired(callback, 'callback', Function);

			const filterBuilder = new FilterBuilder(this);

			callback(filterBuilder);

			this._update = new Update(this._update.table, filterBuilder.filter, this._update.conditionFilter, this._update.expressions, this._update.returnType, this._update.description);

			return this;
		}

		/**
		 * Adds a {@link Filter} targeting the condition expression. Uses a callback
		 * to provides the consumer with a {@link FilterBuilder}.
		 *
		 * @public
		 * @param {Function} callback - Synchronously called, providing a {@link FilterBuilder} tied to the current instance.
		 * @returns {UpdateBuilder}
		 */
		withConditionFilterBuilder(callback) {
			assert.argumentIsRequired(callback, 'callback', Function);

			const filterBuilder = new FilterBuilder(this);

			callback(filterBuilder);

			this._update = new Update(this._update.table, this._update.keyFilter, filterBuilder.filter, this._update.expressions, this._update.returnType, this._update.description);

			return this;
		}

		/**
		 * Creates and adds an {@link UpdateExpression}.
		 *
		 * @public
		 * @param {UpdateActionType} actionType
		 * @param {String} attributeName
		 * @param {UpdateOperatorType=} operatorType
		 * @param operand
		 * @returns {UpdateBuilder}
		 */
		withUpdateExpression(actionType, attributeName, operatorType, operand) {
			assert.argumentIsRequired(actionType, 'actionType', UpdateActionType, 'UpdateActionType');
			assert.argumentIsRequired(attributeName, 'attributeName', String);
			assert.argumentIsOptional(operatorType, 'operatorType', UpdateOperatorType, 'UpdateOperatorType');

			const attribute = this._update.table.attributes.find(a => a.name === attributeName) || null;
			const expression = new UpdateExpression(actionType, attribute, operatorType, operand);

			const expressions = this._update.expressions.concat(expression);

			this._update = new Update(this._update.table, this._update.keyFilter, this._update.conditionFilter, expressions, this._update.returnType, this._update.description);

			return this;
		}

		/**
		 * Add a {@link ReturnValueType} to the update.
		 *
		 * @public
		 * @param {ReturnValueType} returnValueType
		 * @return {UpdateBuilder}
		 */
		withReturnValueType(returnValueType) {
			assert.argumentIsRequired(returnValueType, 'returnValueType', ReturnValueType, 'ReturnValueType');

			this._update = new Update(this._update.table, this._update.keyFilter, this._update.conditionFilter, this._update.expressions, returnValueType, this._update.description);

			return this;
		}

		/**
		 * Adds a description to the update and returns the current instance.
		 *
		 * @public
		 * @param {String} description
		 * @returns {UpdateBuilder}
		 */
		withDescription(description) {
			assert.argumentIsRequired(description, 'description', String);

			this._update = new Update(this._update.table, this._update.keyFilter, this._update.conditionFilter, this._update.expressions, this._update.returnType, description);

			return this;
		}

		/**
		 * Creates a new {@link UpdateBuilder}.
		 *
		 * @public
		 * @static
		 * @param {Table} table
		 * @returns {UpdateBuilder}
		 */
		static targeting(table) {
			assert.argumentIsRequired(table, 'table', Table, 'Table');

			return new UpdateBuilder(table);
		}

		toString() {
			return '[UpdateBuilder]';
		}
	}

	return UpdateBuilder;
})();
