import * as assert from '@barchart/common-js/lang/assert.js';

import KeyType from './../../schema/definitions/KeyType.js';

/**
 * An operator type that can be used in an {@link Expression} as
 * part of a {@link Scan} or {@link Query}.
 *
 * @public
 */
export default class OperatorType {
	#description;
	#formatter;
	#keyTypes;
	#operandCount;

	/**
	 * @param {string} description - The description.
	 * @param {Function} formatter - The formatter.
	 * @param {number} operandCount - The operand count.
	 * @param {Array<KeyType>} keyTypes - The key types.
	 */
	constructor(description, formatter, operandCount, keyTypes) {
		assert.argumentIsRequired(description, 'description', String);
		assert.argumentIsRequired(formatter, 'formatter', Function);
		assert.argumentIsRequired(operandCount, 'operandCount', Number);
		assert.argumentIsArray(keyTypes, 'keyTypes', KeyType, 'KeyType');

		this.#description = description;
		this.#formatter = formatter;
		this.#operandCount = operandCount;
		this.#keyTypes = keyTypes;
	}

	/**
	 * Description of the operator.
	 *
	 * @public
	 * @returns {string}
	 */
	get description() {
		return this.#description;
	}

	/**
	 * The number of expected operands (will be zero, one, or two).
	 *
	 * @public
	 * @returns {number}
	 */
	get operandCount() {
		return this.#operandCount;
	}

	/**
	 * Returns true, if the operator can be used with the {@link KeyType}.
	 *
	 * @public
	 * @param {KeyType} keyType - The type of key to check.
	 * @returns {boolean|*}
	 */
	validFor(keyType) {
		assert.argumentIsRequired(keyType, 'keyType', KeyType, 'KeyType');

		return this.#keyTypes.some(kt => kt === keyType);
	}

	/**
	 * Returns a string suitable for use in an AWS SDK expression.
	 *
	 * @public
	 * @param {string} field
	 * @param {string|Array<string>} operand
	 * @returns {string}
	 */
	format(field, operand) {
		assert.argumentIsRequired(field, 'field', String);

		if (this.#operandCount === 2) {
			assert.argumentIsArray(operand, 'operand', String);
		} else if (this.#operandCount === 1) {
			assert.argumentIsRequired(operand, 'operand', String);
		}

		return this.#formatter(field, operand);
	}

	/**
	 * Equals.
	 *
	 * @public
	 * @static
	 * @returns {OperatorType}
	 */
	static get EQUALS() {
		return operatorTypeEquals;
	}

	/**
	 * Not equals.
	 *
	 * @public
	 * @static
	 * @returns {OperatorType}
	 */
	static get NOT_EQUALS() {
		return operatorTypeNotEquals;
	}

	/**
	 * Greater than.
	 *
	 * @public
	 * @static
	 * @returns {OperatorType}
	 */
	static get GREATER_THAN() {
		return operatorTypeGreaterThan;
	}

	/**
	 * Less than.
	 *
	 * @public
	 * @static
	 * @returns {OperatorType}
	 */
	static get LESS_THAN() {
		return operatorTypeLessThan;
	}

	/**
	 * Greater than or equal to.
	 *
	 * @public
	 * @static
	 * @returns {OperatorType}
	 */
	static get GREATER_THAN_OR_EQUAL_TO() {
		return operatorTypeGreaterThanOrEqualTo;
	}

	/**
	 * Less than or equal to.
	 *
	 * @public
	 * @static
	 * @returns {OperatorType}
	 */
	static get LESS_THAN_OR_EQUAL_TO() {
		return operatorTypeLessThanOrEqualTo;
	}

	/**
	 * Contains.
	 *
	 * @public
	 * @static
	 * @returns {OperatorType}
	 */
	static get CONTAINS() {
		return operatorTypeContains;
	}

	/**
	 * Does not contain.
	 *
	 * @public
	 * @static
	 * @returns {OperatorType}
	 */
	static get DOES_NOT_CONTAIN() {
		return operatorTypeNotContains;
	}

	/**
	 * Between.
	 *
	 * @public
	 * @static
	 * @returns {OperatorType}
	 */
	static get BETWEEN() {
		return operatorTypeBetween;
	}

	/**
	 * Attribute begins with text.
	 *
	 * @public
	 * @static
	 * @returns {OperatorType}
	 */
	static get BEGINS_WITH() {
		return operatorTypeBeginsWith;
	}

	/**
	 * Attribute matches one of the operand values.
	 *
	 * @public
	 * @static
	 * @returns {OperatorType}
	 */
	static get IN() {
		return operatorTypeIn;
	}

	/**
	 * Attribute exists.
	 *
	 * @public
	 * @static
	 * @returns {OperatorType}
	 */
	static get ATTRIBUTE_EXISTS() {
		return operatorTypeAttributeExists;
	}

	/**
	 * Attribute doesn't exist (for use with {@link Conditional} instances only).
	 *
	 * @public
	 * @static
	 * @returns {OperatorType}
	 */
	static get ATTRIBUTE_NOT_EXISTS() {
		return operatorTypeAttributeNotExists;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return `[OperatorType (description=${this.#description})]`;
	}
}

// http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.OperatorsAndFunctions.html

const operatorTypeEquals = new OperatorType('Equals', (f, o) => `${f} = ${o}`, 1, [ KeyType.HASH, KeyType.RANGE ]);
const operatorTypeNotEquals = new OperatorType('Equals', (f, o) => `${f} <> ${o}`, 1, [ KeyType.RANGE ]);
const operatorTypeGreaterThan = new OperatorType('Greater Than', (f, o) => `${f} > ${o}`, 1, [ KeyType.RANGE ]);
const operatorTypeLessThan = new OperatorType('Less Than', (f, o) => `${f} < ${o}`, 1, [ KeyType.RANGE ]);
const operatorTypeGreaterThanOrEqualTo = new OperatorType('Greater Than Or Equal To', (f, o) => `${f} >= ${o}`, 1, [ KeyType.RANGE ]);
const operatorTypeLessThanOrEqualTo = new OperatorType('Less Than Or Equal To', (f, o) => `${f} <= ${o}`, 1, [ KeyType.RANGE ]);
const operatorTypeBetween = new OperatorType('Between', (f, o) => `${f} BETWEEN ${o[0]} AND ${o[1]}`, 2, [ KeyType.RANGE ]);

const operatorTypeBeginsWith = new OperatorType('Begins With', (f, o) => `begins_with(${f}, ${o})`, 1, [ KeyType.RANGE ]);

const operatorTypeContains = new OperatorType('Contains', (f, o) => `contains(${f}, ${o})`, 1, [ KeyType.RANGE ]);
const operatorTypeNotContains = new OperatorType('Does Not Contain', (f, o) => `NOT contains(${f}, ${o})`, 1, [ KeyType.RANGE ]);

const operatorTypeAttributeExists = new OperatorType('Attribute Exists', (f, o) => `attribute_exists(${f})`, 0, [ ]);
const operatorTypeAttributeNotExists = new OperatorType('Attribute Not Exists', (f, o) => `attribute_not_exists(${f})`, 0, [ KeyType.HASH, KeyType.RANGE ]);

const operatorTypeIn = new OperatorType('In', (f, o) => `${f} IN (${o.join(',')})`, 2, [ KeyType.RANGE ]);
