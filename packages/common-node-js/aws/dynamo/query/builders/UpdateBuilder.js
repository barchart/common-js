import * as assert from '@barchart/common-js/lang/assert.js';

import ReturnValueType from './../definitions/ReturnValueType.js';
import Table from './../../schema/definitions/Table.js';
import Update from './../definitions/Update.js';
import UpdateActionType from './../definitions/UpdateActionType.js';
import UpdateExpression from './../definitions/UpdateExpression.js';
import UpdateOperatorType from './../definitions/UpdateOperatorType.js';
import ActionBuilder from './ActionBuilder.js';
import FilterBuilder from './FilterBuilder.js';

/**
 * @typedef {import('../definitions/Action.js').default} Action
 */

/**
 * Fluent interface for building an {@link Update}.
 *
 * @public
 * @extends {ActionBuilder}
 */
export default class UpdateBuilder extends ActionBuilder {
	#update;

	/**
	 * @param {Table} table - The table targeted.
	 */
	constructor(table) {
		super();

		this.#update = new Update(table);
	}

	/**
	 * The {@link Action}, given all the information provided thus far.
	 *
	 * @public
	 * @returns {Action}
	 */
	get action() {
		return this.#update;
	}

	/**
	 * The {@link Update}, given all the information provided thus far.
	 *
	 * @public
	 * @returns {Update}
	 */
	get update() {
		return this.#update;
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

		this.#update = new Update(this.#update.table, filterBuilder.filter, this.#update.conditionFilter, this.#update.expressions, this.#update.returnType, this.#update.description);

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

		this.#update = new Update(this.#update.table, this.#update.keyFilter, filterBuilder.filter, this.#update.expressions, this.#update.returnType, this.#update.description);

		return this;
	}

	/**
	 * Creates and adds an {@link UpdateExpression}.
	 *
	 * @public
	 * @param {UpdateActionType} actionType
	 * @param {string} attributeName
	 * @param {UpdateOperatorType=} operatorType
	 * @param {*=} operand
	 * @returns {UpdateBuilder}
	 */
	withUpdateExpression(actionType, attributeName, operatorType, operand) {
		assert.argumentIsRequired(actionType, 'actionType', UpdateActionType, 'UpdateActionType');
		assert.argumentIsRequired(attributeName, 'attributeName', String);
		assert.argumentIsOptional(operatorType, 'operatorType', UpdateOperatorType, 'UpdateOperatorType');

		const attribute = this.#update.table.attributes.find(a => a.name === attributeName) || null;
		const expression = new UpdateExpression(actionType, attribute, operatorType, operand);

		const expressions = this.#update.expressions.concat(expression);

		this.#update = new Update(this.#update.table, this.#update.keyFilter, this.#update.conditionFilter, expressions, this.#update.returnType, this.#update.description);

		return this;
	}

	/**
	 * Add a {@link ReturnValueType} to the update.
	 *
	 * @public
	 * @param {ReturnValueType} returnValueType
	 * @returns {UpdateBuilder}
	 */
	withReturnValueType(returnValueType) {
		assert.argumentIsRequired(returnValueType, 'returnValueType', ReturnValueType, 'ReturnValueType');

		this.#update = new Update(this.#update.table, this.#update.keyFilter, this.#update.conditionFilter, this.#update.expressions, returnValueType, this.#update.description);

		return this;
	}

	/**
	 * Adds a description to the update and returns the current instance.
	 *
	 * @public
	 * @param {string} description
	 * @returns {UpdateBuilder}
	 */
	withDescription(description) {
		assert.argumentIsRequired(description, 'description', String);

		this.#update = new Update(this.#update.table, this.#update.keyFilter, this.#update.conditionFilter, this.#update.expressions, this.#update.returnType, description);

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

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[UpdateBuilder]';
	}
}
