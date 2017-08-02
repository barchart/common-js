module.exports = (() => {
	'use strict';

	/**
	 * Utilities for interrogating variables (e.g. checking data types).
	 *
	 * @public
	 * @module lang/is
	 */
	return {
		/**
		 * Returns true, if the argument is a number. NaN will return false.
		 *
		 * @static
		 * @public
		 * @param candidate
		 * @returns {boolean}
		 */
		number(candidate) {
			return typeof(candidate) === 'number' && !isNaN(candidate);
		},

		/**
		 * Returns true, if the argument is NaN.
		 *
		 * @static
		 * @public
		 * @param candidate
		 * @returns {boolean}
		 */
		nan(candidate) {
			return typeof(candidate) === 'number' && isNaN(candidate);
		},

		/**
		 * Returns true, if the argument is a valid integer.
		 *
		 * @static
		 * @public
		 * @param candidate
		 * @returns {boolean}
		 */
		integer(candidate) {
			return typeof(candidate) === 'number' && !isNaN(candidate) && (candidate | 0) === candidate;
		},

		/**
		 * Returns true, if the argument is a string.
		 *
		 * @static
		 * @public
		 * @param candidate
		 * @returns {boolean}
		 */
		string(candidate) {
			return typeof(candidate) === 'string';
		},

		/**
		 * Returns true, if the argument is a JavaScript Date instance.
		 *
		 * @static
		 * @public
		 * @param candidate
		 * @returns {boolean}
		 */
		date(candidate) {
			return candidate instanceof Date;
		},

		/**
		 * Returns true, if the argument is a function.
		 *
		 * @static
		 * @public
		 * @param candidate
		 * @returns {boolean}
		 */
		fn(candidate) {
			return typeof(candidate) === 'function';
		},

		/**
		 * Returns true, if the argument is an array.
		 *
		 * @static
		 * @public
		 * @param candidate
		 * @returns {boolean}
		 */
		array(candidate) {
			return Array.isArray(candidate);
		},

		/**
		 * Returns true, if the argument is a Boolean value.
		 *
		 * @static
		 * @public
		 * @param candidate
		 * @returns {boolean}
		 */
		boolean(candidate) {
			return typeof(candidate) === 'boolean';
		},

		/**
		 * Returns true, if the argument is an object.
		 *
		 * @static
		 * @public
		 * @param candidate
		 * @returns {boolean}
		 */
		object(candidate) {
			return typeof(candidate) === 'object' && candidate !== null;
		},

		/**
		 * Returns true, if the argument is a null value.
		 *
		 * @static
		 * @public
		 * @param candidate
		 * @returns {boolean}
		 */
		null(candidate) {
			return candidate === null;
		},

		/**
		 * Returns true, if the argument is an undefined value.
		 *
		 * @static
		 * @public
		 * @param candidate
		 * @returns {boolean}
		 */
		undefined(candidate) {
			return candidate === undefined;
		}
	};
})();