const Enum = require('@barchart/common-js/lang/Enum');

const UpdateOperatorType = require('./UpdateOperatorType');

module.exports = (() => {
	'use strict';

	/**
	 * Defines update action types for UpdateItem operation.
	 *
	 * @public
	 * @extends {Enum}
	 * @param {String} code
	 * @param {String} description
	 * @param {String} keyword
	 * @param {Array<UpdateOperatorType>} allowedOperators
	 */
	class UpdateActionType extends Enum {
		constructor(code, description, keyword, allowedOperators) {
			super(code, description);

			this._keyword = keyword;
			this._operators = allowedOperators || [ ];
		}

		/**
		 * Keyword for action to be used in DyanmoDB query language.
		 *
		 * @public
		 * @returns {String}
		 */
		get keyword() {
			return this._keyword;
		}

		/**
		 * An array of supported operator types.
		 *
		 * @public
		 * @returns {Array<UpdateOperatorType>}
		 */
		get operators() {
			return this._operators;
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

		toString() {
			return `[UpdateActionType (code=${this.code}, description=${this.description})]`;
		}
	}

	const add = new UpdateActionType('add', 'add', 'ADD', [ UpdateOperatorType.SPACE ]);
	const del = new UpdateActionType('delete', 'delete', 'DELETE', [ UpdateOperatorType.SPACE ]);
	const set = new UpdateActionType('set', 'set', 'SET', [ UpdateOperatorType.EQUALS, UpdateOperatorType.EQUALS_IF_NOT_EXISTS, UpdateOperatorType.MINUS, UpdateOperatorType.PLUS, UpdateOperatorType.LIST_APPEND ]);
	const remove = new UpdateActionType('remove', 'remove', 'REMOVE', [ UpdateOperatorType.EMPTY ]);

	return UpdateActionType;
})();
