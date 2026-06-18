import * as assert from './assert.js';

/**
* Utilities for caching results of function invocations (a.k.a. memoization).
*
* @public
* @module lang/memoize
*/

/**
 * Memoizes a function that accepts a single argument only. Furthermore,
 * the parameter's toString function must return a unique value.
 *
 * @static
 * @public
 * @param {Function} fn - The function to memoize. This function should accept one parameter whose "toString" function outputs a unique value.
 */
export function simple(fn) {
	const cache = { };

	return (x) => {
		if (!cache.hasOwnProperty(x)) {
			cache[x] = fn(x);
		}

		return cache[x];
	};
}

/**
 * Wraps a function. The resulting function will call the wrapped function
 * once and cache the result. If a specific duration is supplied, the
 * cache will be dropped after the duration expires and the wrapped
 * function will be invoked again.
 *
 * @public
 * @param {Function} fn
 * @param {number} duration
 * @returns {Function}
 */
export function cache(fn, duration) {
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
