const is = require('./is');

module.exports = (() => {
	'use strict';

	/**
	 * Utilities for caching results of function invocations (a.k.a. memoization).
	 *
	 * @public
	 * @module lang/memoize
	 */
	return {
		/**
		 * Memoizes a function that accepts a single argument only. Furthermore,
		 * the parameter's toString function must return a unique value.
		 *
		 * @static
		 * @public
		 * @param {Function} fn - The function to memoize. This function should accept one parameters whose "toString" function outputs a unique value.
		 */
		simple(fn) {
			const cache = { };

			return (x) => {
				if (cache.hasOwnProperty(x)) {
					return cache[x];
				} else {
					return cache[x] = fn(x);
				}
			};
		}
	};
})();