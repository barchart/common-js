const is = require('@barchart/common-js/lang/is');

const Attribute = require('./../../schema/definitions/Attribute'),
	OperatorType = require('./OperatorType');

module.exports = (() => {
	'use strict';

	/**
	 * An expression that can be used as part of a {@link Filter}.
	 *
	 * @public
	 * @param {Attribute} attribute
	 * @param {OperatorType} operatorType
	 * @param {*} operand
	 */
	class Expression {
		constructor(attribute, operatorType, operand) {
			this._attribute = attribute;
			this._operatorType = operatorType || null;

			let operandToUse;

			if (is.undefined(operand)) {
				operandToUse = null;
			} else {
				operandToUse = operand;
			}

			this._operand = operandToUse;
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
		 * @public
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
			if (!(this._attribute instanceof Attribute)) {
				throw new Error('Expression data type is invalid.');
			}

			if (!(this._operatorType instanceof OperatorType)) {
				throw new Error('Expression data type is invalid.');
			}
		}

		toString() {
			return `[Expression]`;
		}
	}

	return Expression;
})();