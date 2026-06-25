import Enum from '@barchart/common-js/lang/Enum.js';

import UpdateOperatorType from './UpdateOperatorType.js';

/**
 * Defines update action types for UpdateItem operation.
 *
 * @public
 * @extends {Enum}
 */
export default class UpdateActionType extends Enum {
	#keyword;
	#operators;

	/**
	 * @param {string} code - The code.
	 * @param {string} description - The description.
	 * @param {string} keyword - The keyword.
	 * @param {Array<UpdateOperatorType>} allowedOperators - The allowed operators.
	 */
	constructor(code, description, keyword, allowedOperators) {
		super(code, description);

		this.#keyword = keyword;
		this.#operators = allowedOperators || [ ];
	}

	/**
	 * Keyword for action to be used in DynamoDB query language.
	 *
	 * @public
	 * @returns {string}
	 */
	get keyword() {
		return this.#keyword;
	}

	/**
	 * An array of supported operator types.
	 *
	 * @public
	 * @returns {Array<UpdateOperatorType>}
	 */
	get operators() {
		return this.#operators;
	}

	/**
	 * Given a code, returns the enumeration item.
	 *
	 * @public
	 * @static
	 * @param {string} code
	 * @returns {UpdateActionType|null}
	 */
	static parse(code) {
		const value = Enum.fromCode(UpdateActionType, code);

		return value instanceof UpdateActionType ? value : null;
	}

	/**
	 * Add.
	 *
	 * @public
	 * @static
	 * @returns {UpdateActionType}
	 */
	static get ADD() {
		return add;
	}

	/**
	 * Delete.
	 *
	 * @public
	 * @static
	 * @returns {UpdateActionType}
	 */
	static get DELETE() {
		return del;
	}

	/**
	 * Set.
	 *
	 * @public
	 * @static
	 * @returns {UpdateActionType}
	 */
	static get SET() {
		return set;
	}

	/**
	 * Remove.
	 *
	 * @public
	 * @static
	 * @returns {UpdateActionType}
	 */
	static get REMOVE() {
		return remove;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return `[UpdateActionType (code=${this.code}, description=${this.description})]`;
	}
}

const add = new UpdateActionType('add', 'add', 'ADD', [ UpdateOperatorType.SPACE ]);
const del = new UpdateActionType('delete', 'delete', 'DELETE', [ UpdateOperatorType.SPACE ]);
const set = new UpdateActionType('set', 'set', 'SET', [ UpdateOperatorType.EQUALS, UpdateOperatorType.EQUALS_IF_NOT_EXISTS, UpdateOperatorType.MINUS, UpdateOperatorType.PLUS, UpdateOperatorType.LIST_APPEND ]);
const remove = new UpdateActionType('remove', 'remove', 'REMOVE', [ UpdateOperatorType.EMPTY ]);
