import * as is from '@barchart/common-js/lang/is.js';

import Attribute from './../../schema/definitions/Attribute.js';
import UpdateActionType from './UpdateActionType.js';
import UpdateOperatorType from './UpdateOperatorType.js';

/**
 * @typedef {import('./OperatorType.js').default} OperatorType
 */

/**
 * Defines the change to make to one field during an {@link Update} operation.
 *
 * @public
 */
export default class UpdateExpression {
	#actionType;
	#attribute;
	#operand;
	#operatorType;

	/**
	 * @param {UpdateActionType} actionType - The action type.
	 * @param {Attribute} attribute - The attribute.
	 * @param {UpdateOperatorType} operatorType - The operator type.
	 * @param {*} operand - The operand.
	 */
	constructor(actionType, attribute, operatorType, operand) {
		this.#actionType = actionType;
		this.#attribute = attribute;
		this.#operatorType = operatorType || UpdateOperatorType.EMPTY;

		let operandToUse;

		if (is.undef(operand)) {
			operandToUse = null;
		} else {
			operandToUse = operand;
		}

		this.#operand = operandToUse;
	}

	/**
	 * The {@link UpdateActionType} of update action.
	 *
	 * @public
	 * @returns {UpdateActionType}
	 */
	get actionType() {
		return this.#actionType;
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
	 * The {@link UpdateOperatorType} used by the expression.
	 *
	 * @public
	 * @returns {UpdateOperatorType}
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
		if (!(this.#actionType instanceof UpdateActionType)) {
			throw new Error('ActionType data type is invalid.');
		}

		if (!(this.#attribute instanceof Attribute)) {
			throw new Error('Attribute data type is invalid.');
		}

		if (!(this.#operatorType instanceof UpdateOperatorType)) {
			throw new Error('OperatorType data type is invalid.');
		}

		if (!(this.#actionType.operators.includes(this.#operatorType))) {
			throw new Error(`OperatorType ${this.#operatorType} incompatible with ${this.#actionType} ActionType`);
		}
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return `[UpdateExpression]`;
	}
}
