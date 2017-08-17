const assert = require('./../../lang/assert');

module.exports = (() => {
	'use strict';

	/**
	 * Functions that can use used as comparators.
	 *
	 * @public
	 * @module collections/sorting/comparators
	 */
	return {
		/**
		 * Compares two dates (in ascending order).
		 *
		 * @static
		 * @param {Date} a
		 * @param {Date} b
		 * @returns {Number}
		 */
		compareDates: (a, b) => {
			assert.argumentIsRequired(a, 'a', Date);
			assert.argumentIsRequired(b, 'b', Date);

			return a - b;
		},

		/**
		 * Compares two numbers (in ascending order).
		 *
		 * @static
		 * @param {Number} a
		 * @param {Number} b
		 * @returns {Number}
		 */
		compareNumbers: (a, b) => {
			assert.argumentIsRequired(a, 'a', Number);
			assert.argumentIsRequired(b, 'b', Number);

			return a - b;
		},

		/**
		 * Compares two strings (in ascending order), using {@link String#localeCompare}.
		 *
		 * @static
		 * @param {Number} a
		 * @param {Number} b
		 * @returns {Number}
		 */
		compareStrings: (a, b) => {
			assert.argumentIsRequired(a, 'a', String);
			assert.argumentIsRequired(b, 'b', String);

			return a.localeCompare(b);
		},

		/**
		 * Compares two objects, always returning zero.
		 *
		 * @static
		 * @param {*} a
		 * @param {*} b
		 * @returns {Number}
		 */
		empty: (a, b) => {
			return 0;
		}
	};
})();