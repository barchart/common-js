import * as assert from '@barchart/common-js/lang/assert.js';

/**
 * Defines the update operator type enumeration.
 *
 * @public
 */
export default class UpdateOperatorType {
	#description;
	#formatter;
	#operandCount;

	/**
	 * @param {string} description - The description.
	 * @param {*} formatter - The formatter.
	 * @param {*} operandCount - The operand count.
	 */
	constructor(description, formatter, operandCount) {
		assert.argumentIsRequired(description, 'description', String);
		assert.argumentIsRequired(formatter, 'formatter', Function);
		assert.argumentIsRequired(operandCount, 'operandCount', Number);

		this.#description = description;
		this.#formatter = formatter;
		this.#operandCount = operandCount;
	}

	/**
	 * The number of expected operands.
	 *
	 * @public
	 * @returns {number}
	 */
	get operandCount() {
		return this.#operandCount;
	}

	/**
	 * Returns a string suitable for use in an AWS SDK expression.
	 *
	 * @public
	 * @param {string} field
	 * @param {*} operand
	 * @returns {string}
	 */
	format(field, operand) {
		assert.argumentIsRequired(field, 'field', String);

		return this.#formatter(field, operand);
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

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return `[UpdateOperatorType (description=${this.#description})]`;
	}
}

const operatorEmpty = new UpdateOperatorType('Empty', (f) => `${f}`, 0);
const operatorSpace = new UpdateOperatorType('Space', (f, o) => `${f} ${o}`, 1);
const operatorEquals = new UpdateOperatorType('Equals', (f, o) => `${f} = ${o}`, 1);
const operatorEqualsIfNotExists = new UpdateOperatorType('Equals if attribute not exists', (f, o) => `${f} = if_not_exists(${f}, ${o})`, 1);
const operatorPlus = new UpdateOperatorType('Plus', (f, o) => `${f} = ${f} + ${o}`, 1);
const operatorMinus = new UpdateOperatorType('Minus', (f, o) => `${f} = ${f} - ${o}`, 1);
const operatorListAppend = new UpdateOperatorType('List append', (f, o) => `${f} = list_append(${f}, ${o})`, 1);
