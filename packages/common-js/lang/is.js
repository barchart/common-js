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
 * @returns {candidate is number}
 */
export function number(candidate) {
	return typeof candidate === 'number' && !isNaN(candidate);
}

/**
 * Returns true if the argument is NaN.
 *
 * @static
 * @public
 * @param {*} candidate
 * @returns {candidate is number}
 */
export function nan(candidate) {
	return typeof candidate === 'number' && isNaN(candidate);
}

/**
 * Returns true if the argument is a valid 32-bit integer.
 *
 * @static
 * @public
 * @param {*} candidate
 * @returns {candidate is number}
 */
export function integer(candidate) {
	return typeof candidate === 'number' && Number.isInteger(candidate) && candidate >= -2147483648 && candidate <= 2147483647;
}

/**
 * Returns true if the argument is a valid integer (which can exceed 32 bits); however,
 * the check can fail above the value of Number.MAX_SAFE_INTEGER.
 *
 * @static
 * @public
 * @param {*} candidate
 * @returns {candidate is number}
 */
export function large(candidate) {
	return typeof candidate === 'number' && !isNaN(candidate) && isFinite(candidate) && Math.floor(candidate) === candidate;
}

/**
 * Returns true if the argument is a positive number.
 *
 * @static
 * @public
 * @param {*} candidate
 * @returns {candidate is number}
 */
export function positive(candidate) {
	return number(candidate) && candidate > 0;
}

/**
 * Returns true if the argument is a negative number.
 *
 * @static
 * @public
 * @param {*} candidate
 * @returns {candidate is number}
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
 * @returns {candidate is Iterable<*>}
 */
export function iterable(candidate) {
	return !nil(candidate) && !undef(candidate) && fn(candidate[Symbol.iterator]);
}

/**
 * Returns true if the argument is a string.
 *
 * @static
 * @public
 * @param {*} candidate
 * @returns {candidate is string}
 */
export function string(candidate) {
	return typeof candidate === 'string';
}

/**
 * Returns true if the argument is a JavaScript Date instance.
 *
 * @static
 * @public
 * @param {*} candidate
 * @returns {candidate is Date}
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
 * @returns {candidate is RegExp}
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
 * @returns {candidate is Function}
 */
export function fn(candidate) {
	return typeof candidate === 'function';
}

/**
 * Returns true if the argument is an array.
 *
 * @static
 * @public
 * @param {*} candidate
 * @returns {candidate is *[]}
 */
export function array(candidate) {
	return Array.isArray(candidate);
}

/**
 * Returns true if the argument is a boolean value.
 *
 * @static
 * @public
 * @param {*} candidate
 * @returns {candidate is boolean}
 */
export function boolean(candidate) {
	return typeof candidate === 'boolean';
}

/**
 * Returns true if the argument is a non-null object.
 *
 * @static
 * @public
 * @param {*} candidate
 * @returns {candidate is object}
 */
export function object(candidate) {
	return typeof candidate === 'object' && candidate !== null;
}

/**
 * Returns true if the argument is null.
 *
 * @static
 * @public
 * @param {*} candidate
 * @returns {candidate is null}
 */
export function nil(candidate) {
	return candidate === null;
}

/**
 * Returns true if the argument is undefined.
 *
 * @static
 * @public
 * @param {*} candidate
 * @returns {candidate is undefined}
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
 * @returns {candidate is string}
 */
export function zeroLengthString(candidate) {
	return string(candidate) && candidate.length === 0;
}

/**
 * Given two classes, determines if the "child" class extends
 * the "parent" class (without instantiation).
 *
 * @public
 * @param {Function} parent
 * @param {Function} child
 * @returns {boolean}
 */
export function extension(parent, child) {
	return fn(parent) && fn(child) && child.prototype instanceof parent;
}