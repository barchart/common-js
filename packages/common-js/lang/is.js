/**
* Utilities for interrogating variables (e.g. checking data types).
*
* @public
* @module lang/is
*/

/**
 * Returns true if the argument is a number. NaN will return false.
 *
 * @static
 * @public
 * @param {*} candidate
 * @returns {boolean}
 */
export function number(candidate) {
	return typeof(candidate) === 'number' && !isNaN(candidate);
}

/**
 * Returns true if the argument is NaN.
 *
 * @static
 * @public
 * @param {*} candidate
 * @returns {boolean}
 */
export function nan(candidate) {
	return typeof(candidate) === 'number' && isNaN(candidate);
}

/**
 * Returns true if the argument is a valid 32-bit integer.
 *
 * @static
 * @public
 * @param {*} candidate
 * @returns {boolean}
 */
export function integer(candidate) {
	return typeof(candidate) === 'number' && !isNaN(candidate) && (candidate | 0) === candidate;
}

/**
 * Returns true if the argument is a valid integer (which can exceed 32 bits); however,
 * the check can fail above the value of Number.MAX_SAFE_INTEGER.
 *
 * @static
 * @public
 * @param {*) candidate
 * @returns {boolean}
 */
export function large(candidate) {
	return typeof(candidate) === 'number' && !isNaN(candidate) && isFinite(candidate) && Math.floor(candidate) === candidate;
}

/**
 * Returns true if the argument is a number that is positive.
 *
 * @static
 * @public
 * @param {*} candidate
 * @returns {boolean}
 */
export function positive(candidate) {
	return number(candidate) && candidate > 0;
}

/**
 * Returns true if the argument is a number that is negative.
 *
 * @static
 * @public
 * @param {*} candidate
 * @returns {boolean}
 */
export function negative(candidate) {
	return number(candidate) && candidate < 0;
}

/**
 * Returns true if the argument is iterable.
 *
 * @static
 * @public
 * @param {*} candidate
 * @returns {boolean}
 */
export function iterable(candidate) {
	return !isNull(candidate) && !isUndefined(candidate) && fn(candidate[Symbol.iterator]);
}

/**
 * Returns true if the argument is a string.
 *
 * @static
 * @public
 * @param {*} candidate
 * @returns {boolean}
 */
export function string(candidate) {
	return typeof(candidate) === 'string';
}

/**
 * Returns true if the argument is a JavaScript Date instance.
 *
 * @static
 * @public
 * @param {*} candidate
 * @returns {boolean}
 */
export function date(candidate) {
	return candidate instanceof Date;
}

/**
 * Returns true if the argument is a JavaScript RegExp instance.
 *
 * @static
 * @public
 * @param {*} candidate
 * @returns {boolean}
 */
export function regexp(candidate) {
	return candidate instanceof RegExp;
}

/**
 * Returns true if the argument is a function.
 *
 * @static
 * @public
 * @param {*} candidate
 * @returns {boolean}
 */
export function fn(candidate) {
	return typeof(candidate) === 'function';
}

/**
 * Returns true if the argument is an array.
 *
 * @static
 * @public
 * @param {*} candidate
 * @returns {boolean}
 */
export function array(candidate) {
	return Array.isArray(candidate);
}

/**
 * Returns true if the argument is a Boolean value.
 *
 * @static
 * @public
 * @param {*} candidate
 * @returns {boolean}
 */
export function boolean(candidate) {
	return typeof(candidate) === 'boolean';
}

/**
 * Returns true if the argument is an object.
 *
 * @static
 * @public
 * @param {*} candidate
 * @returns {boolean}
 */
export function object(candidate) {
	return typeof(candidate) === 'object' && candidate !== null;
}

/**
 * Returns true if the argument is a null value.
 *
 * @static
 * @public
 * @param {*} candidate
 * @returns {boolean}
 */
export function nil(candidate) {
	return candidate === null;
}

/**
 * Returns true if the argument is an undefined value.
 *
 * @static
 * @public
 * @param {*} candidate
 * @returns {boolean}
 */
export function undef(candidate) {
	return candidate === undefined;
}

/**
 * Returns true if the argument is a zero-length string.
 *
 * @static
 * @public
 * @param {*} candidate
 * @returns {boolean}
 */
export function zeroLengthString(candidate) {
	return string(candidate) && candidate.length === 0;
}

/**
 * Given two classes, determines if the "child" class extends
 * the "parent" class (without instantiation).
 *
 * @param {Function} parent
 * @param {Function} child
 * @returns {Boolean}
 */
export function extension(parent, child) {
	return fn(parent) && fn(child) && child.prototype instanceof parent;
}

export { nil as null, undef as undefined };
