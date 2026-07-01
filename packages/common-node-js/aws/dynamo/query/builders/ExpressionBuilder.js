import * as assert from '@barchart/common-js/lang/assert.js';

import Expression from './../definitions/Expression.js';
import OperatorType from './../definitions/OperatorType.js';
import ActionBuilder from './ActionBuilder.js';

/**
 * @typedef {import('../../schema/definitions/Attribute.js').default} Attribute
 */

/**
 * Fluent interface for building an {@link Expression}.
 *
 * @public
 */
export default class ExpressionBuilder {
	#expression;

	/**
	 * @param {string} attributeName - The attribute name.
	 * @param {ActionBuilder} parent - The parent.
	 */
	constructor(attributeName, parent) {
		assert.argumentIsRequired(attributeName, 'attributeName', String);
		assert.argumentIsRequired(parent, 'parent', ActionBuilder, 'ActionBuilder');

		this.#expression = new Expression(getAttribute(attributeName, parent), null, null);
	}

	/**
	 * The {@link Expression}, given all the information provided thus far.
	 *
	 * @public
	 * @returns {Expression}
	 */
	get expression() {
		return this.#expression;
	}

	/**
	 * Set the {@link OperatorType} and returns the current instance.
	 *
	 * @public
	 * @param {OperatorType} operatorType
	 * @returns {ExpressionBuilder}
	 */
	withOperatorType(operatorType) {
		assert.argumentIsRequired(operatorType, 'operatorType', OperatorType, 'OperatorType');

		this.#expression = new Expression(this.#expression.attribute, operatorType, this.#expression.operand);

		return this;
	}

	/**
	 * Set the operand and returns the current instance.
	 *
	 * @public
	 * @param {*} operand
	 * @returns {ExpressionBuilder}
	 */
	withOperand(operand) {
		this.#expression = new Expression(this.#expression.attribute, this.#expression.operatorType, operand);

		return this;
	}

	/**
	 * Constructs a new, and incomplete, {@link ExpressionBuilder}.
	 *
	 * @public
	 * @static
	 * @param {Attribute} attribute
	 * @param {ActionBuilder} parent
	 * @returns {ExpressionBuilder}
	 */
	static withAttribute(attribute, parent) {
		return new ExpressionBuilder(attribute.name, parent);
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[ExpressionBuilder]';
	}
}

function getAttribute(name, parent) {
	return parent.action.table.attributes.find(a => a.name === name) || null;
}
