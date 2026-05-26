const assert = require('@barchart/common-js/lang/assert');

module.exports = (() => {
	'use strict';

	/**
	 * Defines the ordering of results of a {@link Query}.
	 *
	 * @public
	 * @param {String} description
	 * @param {Boolean} forward
	 */
	class OrderingType {
		constructor(description, forward) {
			assert.argumentIsRequired(description, 'description', String);
			assert.argumentIsRequired(forward, 'forward', Boolean);

			this._description = description;
			this._forward = forward;
		}

		/**
		 * Description of the operator.
		 *
		 * @public
		 * @returns {String}
		 */
		get description() {
			return this._description;
		}

		/**
		 * Direction of the sort. True causes results to be returned in
		 * ascending order; false causes results to be returned in
		 * descending order.
		 *
		 * @public
		 * @returns {Number}
		 */
		get forward() {
			return this._forward;
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

		toString() {
			return `[OrderingType (description=${this._description})]`;
		}
	}

	const orderingTypeAscending = new OrderingType('ascending', true);
	const orderingTypeDescending = new OrderingType('descending', false);

	return OrderingType;
})();