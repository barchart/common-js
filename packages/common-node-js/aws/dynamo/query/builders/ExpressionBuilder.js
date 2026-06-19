import * as assert from '@barchart/common-js/lang/assert.js';

import Expression from './../definitions/Expression.js';
import OperatorType from './../definitions/OperatorType.js';

/**
 * @typedef {import('./ActionBuilder.js').default} ActionBuilder
 */

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
	 * @param {string} attributeName
	 * @param {ActionBuilder} parent
	 */
	constructor(attributeName, parent) {
		assert.argumentIsRequired(attributeName, 'attributeName', String);

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
