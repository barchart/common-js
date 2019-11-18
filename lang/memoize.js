const assert = require('./assert');

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
		},

		/**
		 * Wraps a function. The resulting function will call the wrapped function
		 * once and cache the result. If a specific duration is supplied, the
		 * cache will be dropped after the duration expires and the wrapped
		 * function will be invoked again.
		 *
		 * @public
		 * @param {Function} fn
		 * @param {Number} duration
		 * @returns {Function}
		 */
		cache(fn, duration) {
			assert.argumentIsRequired(fn, 'fn', Function);
			assert.argumentIsOptional(duration, 'duration', Number);

			const durationToUse = duration || 0;

			let executionTime = null;
			let cacheResult = null;

			return () => {
				const currentTime = (new Date()).getTime();

				if (executionTime === null || (durationToUse > 0 && currentTime > (executionTime + durationToUse))) {
					executionTime = currentTime;

					cacheResult = fn();
				}

				return cacheResult;
			};
		}
	};
})();