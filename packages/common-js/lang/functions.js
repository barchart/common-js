module.exports = (() => {
	'use strict';

	function tautology(x) {
		return x;
	}

	function empty() {
		return;
	}

	/**
	 * Utilities for working with functions.
	 *
	 * @public
	 * @module lang/functions
	 */
	return {
		/**
		 * A function that returns the first argument passed.
		 *
		 * @static
		 * @returns {Function}
		 */
		getTautology() {
			return tautology;
		},

		/**
		 * A function with no return value.
		 *
		 * @static
		 * @returns {Function}
		 */
		getEmpty() {
			return empty;
		}
	};
})();