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

/**
 * A function that returns the first argument passed.
 *
 * @static
 * @returns {Function}
 */
export function getTautology() {
	return tautology;
}

/**
 * A function with no return value.
 *
 * @static
 * @returns {Function}
 */
export function getEmpty() {
	return empty;
}
