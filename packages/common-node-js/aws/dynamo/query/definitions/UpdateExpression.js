const is = require('@barchart/common-js/lang/is');

const Attribute = require('./../../schema/definitions/Attribute'),
	UpdateActionType = require('./UpdateActionType'),
	UpdateOperatorType = require('./UpdateOperatorType');

module.exports = (() => {
	'use strict';

	/**
	 * Defines the change to make to one field during an {@link Update} operation.
	 *
	 * @public
	 * @param {UpdateActionType} actionType
	 * @param {Attribute} attribute
	 * @param {UpdateOperatorType} operatorType
	 * @param {*} operand
	 */
	class UpdateExpression {
		constructor(actionType, attribute, operatorType, operand) {
			this._actionType = actionType;
			this._attribute = attribute;
			this._operatorType = operatorType || UpdateOperatorType.EMPTY;

			let operandToUse;

			if (is.undefined(operand)) {
				operandToUse = null;
			} else {
				operandToUse = operand;
			}

			this._operand = operandToUse;
		}

		/**
		 * The {@link UpdateActionType} of update action.
		 *
		 * @public
		 * @returns {UpdateActionType}
		 */
		get actionType() {
			return this._actionType;
		}

		/**
		 * The {@link Attribute} targeted by the expression.
		 *
		 * @public
		 * @returns {Attribute}
		 */
		get attribute() {
			return this._attribute;
		}

		/**
		 * The {@link OperatorType} used by the expression.
		 *
		 * @public
		 * @returns {OperatorType}
		 */
		get operatorType() {
			return this._operatorType;
		}

		/**
		 * The operand used by the expression.
		 *
		 * @returns {*}
		 */
		get operand() {
			return this._operand;
		}

		/**
		 * Throws an {@link Error} if the instance is invalid.
		 *
		 * @public
		 */
		validate() {
			if (!(this._actionType instanceof UpdateActionType)) {
				throw new Error('ActionType data type is invalid.');
			}

			if (!(this._attribute instanceof Attribute)) {
				throw new Error('Attribute data type is invalid.');
			}

			if (!(this._operatorType instanceof UpdateOperatorType)) {
				throw new Error('OperatorType data type is invalid.');
			}

			if (!(this._actionType.operators.includes(this._operatorType))) {
				throw new Error(`OperatorType ${this._operatorType} incompatible with ${this._actionType} ActionType`);
			}
		}

		toString() {
			return `[UpdateExpression]`;
		}
	}

	return UpdateExpression;
})();
