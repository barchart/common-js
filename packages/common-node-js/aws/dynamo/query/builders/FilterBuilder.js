import * as assert from '@barchart/common-js/lang/assert.js';

import Filter from './../definitions/Filter.js';
import ExpressionBuilder from './ExpressionBuilder.js';

/**
 * Fluent interface for building a {@link Filter}.
 *
 * @public
 * @param {ActionBuilder} parent
 */
export default class FilterBuilder {
	constructor(parent) {
		this._filter = new Filter([ ]);
		this._parent = parent;
	}

	/**
	 * The {@link Filter}, given all the information provided thus far.
	 *
	 * @public
	 * @returns {Filter}
	 */
	get filter() {
		return this._filter;
	}

	/**
	 * Adds an {@link Expression} to the filter, given all the
	 * components of an expression, then returns the current instance.
	 *
	 * @public
	 * @param {String} attributeName - The attribute name.
	 * @param {OperatorType} operatorType
	 * @param {*=} operand
	 * @returns {FilterBuilder}
	 */
	withExpression(attributeName, operatorType, operand) {
		return this.withExpressionBuilder(attributeName, eb => eb.withOperatorType(operatorType).withOperand(operand));
	}

	/**
	 * Adds an {@link Expression} to the filter, using a callback that
	 * provides the consumer with an {@ExpressionBuilder}, then returns
	 * the current instance.
	 *
	 * @public
	 * @param {String} attributeName - The {@link Attribute} to target.
	 * @param {Function} callback - Synchronously called, providing a {@link ExpressionBuilder} tied to the current instance.
	 * @returns {FilterBuilder}
	 */
	withExpressionBuilder(attributeName, callback) {
		assert.argumentIsRequired(attributeName, 'attributeName', String);
		assert.argumentIsRequired(callback, 'callback', Function);

		const expressionBuilder = new ExpressionBuilder(attributeName, this._parent);

		callback(expressionBuilder);

		this._filter = new Filter(this._filter.expressions.concat([ expressionBuilder.expression ]));

		return this;
	}

	toString() {
		return '[FilterBuilder]';
	}
}
