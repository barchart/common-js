import * as is from '@barchart/common-js/lang/is.js';

import Attribute from './../../schema/definitions/Attribute.js';
import OperatorType from './OperatorType.js';

/**
 * An expression that can be used as part of a {@link Filter}.
 *
 * @public
 */
export default class Expression {
	#attribute;
	#operand;
	#operatorType;

	/**
	 * @param {Attribute} attribute - The attribute.
	 * @param {OperatorType=} operatorType - The operator type.
	 * @param {*=} operand - The operand.
	 */
	constructor(attribute, operatorType, operand) {
		this.#attribute = attribute;
		this.#operatorType = operatorType || null;

		let operandToUse;

		if (is.undef(operand)) {
			operandToUse = null;
		} else {
			operandToUse = operand;
		}

		this.#operand = operandToUse;
	}

	/**
	 * The {@link Attribute} targeted by the expression.
	 *
	 * @public
	 * @returns {Attribute}
	 */
	get attribute() {
		return this.#attribute;
	}

	/**
	 * The {@link OperatorType} used by the expression.
	 *
	 * @public
	 * @returns {OperatorType}
	 */
	get operatorType() {
		return this.#operatorType;
	}

	/**
	 * The operand used by the expression.
	 *
	 * @public
	 * @returns {*}
	 */
	get operand() {
		return this.#operand;
	}

	/**
	 * Throws an {@link Error} if the instance is invalid.
	 *
	 * @public
	 */
	validate() {
		if (!(this.#attribute instanceof Attribute)) {
			throw new Error('Expression data type is invalid.');
		}

		if (!(this.#operatorType instanceof OperatorType)) {
			throw new Error('Expression data type is invalid.');
		}
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return `[Expression]`;
	}
}
