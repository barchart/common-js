import * as assert from '@barchart/common-js/lang/assert.js';

import Enum from '@barchart/common-js/lang/Enum.js';

/**
 * Defines return value types for DynamoDB operations.
 *
 * @public
 * @extends {Enum}
 */
export default class ReturnValueType extends Enum {
	#keyword;

	/**
	 * @param {string} code
	 * @param {string} description
	 * @param {string} keyword
	 */
	constructor(code, description, keyword) {
		super(code, description);

		assert.argumentIsRequired(keyword, 'keyword', String);

		this.#keyword = keyword;
	}

	/**
	 * Keyword to be used in DynamoDB query language.
	 *
	 * @public
	 * @returns {string}
	 */
	get keyword() {
		return this.#keyword;
	}

	/**
	 * Nothing is returned.
	 *
	 * @public
	 * @static
	 * @returns {ReturnValueType}
	 */
	static get NONE() {
		return returnTypeNone;
	}

	/**
	 * Returns all the attributes of the item, as they appeared before the update operation.
	 *
	 * @public
	 * @static
	 * @returns {ReturnValueType}
	 */
	static get ALL_OLD() {
		return returnTypeAllOld;
	}

	/**
	 * Returns only the updated attributes, as they appeared before the update operation.
	 *
	 * @public
	 * @static
	 * @returns {ReturnValueType}
	 */
	static get UPDATED_OLD() {
		return returnTypeUpdatedOld;
	}

	/**
	 * Returns all the attributes of the item, as they appear after the update operation.
	 *
	 * @public
	 * @static
	 * @returns {ReturnValueType}
	 */
	static get ALL_NEW() {
		return returnTypeAllNew;
	}

	/**
	 * Returns only the updated attributes, as they appear after the update operation.
	 *
	 * @public
	 * @static
	 * @returns {ReturnValueType}
	 */
	static get UPDATED_NEW() {
		return returnTypeUpdatedNew;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return `[ReturnValueType (code=${this.code}, description=${this.description})]`;
	}
}

const returnTypeNone = new ReturnValueType('none', 'none', 'NONE');
const returnTypeAllOld = new ReturnValueType('all-old', 'All old', 'ALL_OLD');
const returnTypeUpdatedOld = new ReturnValueType('updated-old', 'Updated old', 'UPDATED_OLD');
const returnTypeAllNew = new ReturnValueType('all-new', 'All new', 'ALL_NEW');
const returnTypeUpdatedNew = new ReturnValueType('updated-new', 'Updated new', 'UPDATED_NEW');
