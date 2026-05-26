const assert = require('@barchart/common-js/lang/assert');

module.exports = (() => {
	'use strict';

	class UpdateOperatorType {
		constructor(description, formatter, operandCount) {
			assert.argumentIsRequired(description, 'description', String);
			assert.argumentIsRequired(formatter, 'formatter', Function);
			assert.argumentIsRequired(operandCount, 'operandCount', Number);

			this._description = description;
			this._formatter = formatter;
			this._operandCount = operandCount;
		}

		/**
		 * The number of expected operands.
		 *
		 * @public
		 * @returns {Number}
		 */
		get operandCount() {
			return this._operandCount;
		}

		/**
		 * Returns a string suitable for use in an AWS SDK expression.
		 *
		 * @public
		 * @param {String} field
		 * @param {*} operand
		 * @returns {String}
		 */
		format(field, operand) {
			assert.argumentIsRequired(field, 'field', String);

			return this._formatter(field, operand);
		}

		/**
		 * Empty.
		 *
		 * @public
		 * @static
		 * @returns {UpdateOperatorType}
		 */
		static get EMPTY() {
			return operatorEmpty;
		}

		/**
		 * Space.
		 *
		 * @public
		 * @static
		 * @returns {UpdateOperatorType}
		 */
		static get SPACE() {
			return operatorSpace;
		}

		/**
		 * Equals.
		 *
		 * @public
		 * @static
		 * @returns {UpdateOperatorType}
		 */
		static get EQUALS() {
			return operatorEquals;
		}

		/**
		 * Plus.
		 *
		 * @public
		 * @static
		 * @returns {UpdateOperatorType}
		 */
		static get PLUS() {
			return operatorPlus;
		}

		/**
		 * Minus.
		 *
		 * @public
		 * @static
		 * @returns {UpdateOperatorType}
		 */
		static get MINUS() {
			return operatorMinus;
		}

		/**
		 * Equals if not exists.
		 *
		 * @public
		 * @static
		 * @returns {UpdateOperatorType}
		 */
		static get EQUALS_IF_NOT_EXISTS() {
			return operatorEqualsIfNotExists;
		}

		/**
		 * List append.
		 *
		 * @public
		 * @static
		 * @returns {UpdateOperatorType}
		 */
		static get LIST_APPEND() {
			return operatorListAppend;
		}

		toString() {
			return `[UpdateOperatorType (description=${this._description})]`;
		}
	}

	const operatorEmpty = new UpdateOperatorType('Empty', (f) => `${f}`, 0);
	const operatorSpace = new UpdateOperatorType('Space', (f, o) => `${f} ${o}`, 1);
	const operatorEquals = new UpdateOperatorType('Equals', (f, o) => `${f} = ${o}`, 1);
	const operatorEqualsIfNotExists = new UpdateOperatorType('Equals if attribute not exists', (f, o) => `${f} = if_not_exists(${f}, ${o})`, 1);
	const operatorPlus = new UpdateOperatorType('Plus', (f, o) => `${f} = ${f} + ${o}`, 1);
	const operatorMinus = new UpdateOperatorType('Minus', (f, o) => `${f} = ${f} - ${o}`, 1);
	const operatorListAppend = new UpdateOperatorType('List append', (f, o) => `${f} = list_append(${f}, ${o})`, 1);

	return UpdateOperatorType;
})();
