import * as assert from './../../lang/assert.js';

/**
 * Functions that can be used as comparators.
 *
 * @public
 * @module collections/sorting/comparators
 */

/**
 * Compares two dates (in ascending order).
 *
 * @public
 * @static
 * @param {Date} a
 * @param {Date} b
 * @returns {number}
 */
export function compareDates(a, b) {
	assert.argumentIsRequired(a, 'a', Date);
	assert.argumentIsRequired(b, 'b', Date);

	return a.getTime() - b.getTime();
}

/**
 * Compares two numbers (in ascending order).
 *
 * @public
 * @static
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export function compareNumbers(a, b) {
	assert.argumentIsRequired(a, 'a', Number);
	assert.argumentIsRequired(b, 'b', Number);

	return a - b;
}

/**
 * Compares two strings (in ascending order), using {@link string#localeCompare}.
 *
 * @public
 * @static
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
export function compareStrings(a, b) {
	assert.argumentIsRequired(a, 'a', String);
	assert.argumentIsRequired(b, 'b', String);

	return a.localeCompare(b);
}

/**
 * Compares two boolean values (in ascending order -- false first, true second).
 *
 * @public
 * @static
 * @param {boolean} a
 * @param {boolean} b
 * @returns {number}
 */
export function compareBooleans(a, b) {
	assert.argumentIsRequired(a, 'a', Boolean);
	assert.argumentIsRequired(b, 'b', Boolean);

	if (a === b) {
		return 0;
	} else if (a) {
		return 1;
	} else {
		return -1;
	}
}

/**
 * Compares two values for nulls (in ascending order -- null first, non-null second).
 *
 * @public
 * @static
 * @param {*|null} a
 * @param {*|null} b
 * @returns {number}
 */
export function compareNull(a, b) {
	if (a === null && b !== null) {
		return -1;
	} else if (a !== null && b === null) {
		return 1;
	} else {
		return 0;
	}
}

/**
 * Compares two objects, always returning zero.
 *
 * @public
 * @static
 * @param {*} a
 * @param {*} b
 * @returns {number}
 */
export function empty(a, b) {
	return 0;
}
