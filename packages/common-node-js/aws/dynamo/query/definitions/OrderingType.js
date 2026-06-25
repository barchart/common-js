import * as assert from '@barchart/common-js/lang/assert.js';

/**
 * Defines the ordering of results of a {@link Query}.
 *
 * @public
 */
export default class OrderingType {
	#description;
	#forward;

	/**
	 * @param {string} description - The description.
	 * @param {boolean} forward - The forward.
	 */
	constructor(description, forward) {
		assert.argumentIsRequired(description, 'description', String);
		assert.argumentIsRequired(forward, 'forward', Boolean);

		this.#description = description;
		this.#forward = forward;
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
	 * Direction of the sort. True causes results to be returned in
	 * ascending order; false causes results to be returned in
	 * descending order.
	 *
	 * @public
	 * @returns {boolean}
	 */
	get forward() {
		return this.#forward;
	}

	/**
	 * Ascending.
	 *
	 * @public
	 * @static
	 * @returns {OrderingType}
	 */
	static get ASCENDING() {
		return orderingTypeAscending;
	}

	/**
	 * Descending.
	 *
	 * @public
	 * @static
	 * @returns {OrderingType}
	 */
	static get DESCENDING() {
		return orderingTypeDescending;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return `[OrderingType (description=${this.#description})]`;
	}
}

const orderingTypeAscending = new OrderingType('ascending', true);
const orderingTypeDescending = new OrderingType('descending', false);
