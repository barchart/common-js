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
 * @returns {Number}
 */
export function compareDates(a, b) {
	assert.argumentIsRequired(a, 'a', Date);
	assert.argumentIsRequired(b, 'b', Date);

	return a - b;
}

/**
 * Compares two numbers (in ascending order).
 *
 * @public
 * @static
 * @param {Number} a
 * @param {Number} b
 * @returns {Number}
 */
export function compareNumbers(a, b) {
	assert.argumentIsRequired(a, 'a', Number);
	assert.argumentIsRequired(b, 'b', Number);

	return a - b;
}

/**
 * Compares two strings (in ascending order), using {@link String#localeCompare}.
 *
 * @public
 * @static
 * @param {String} a
 * @param {String} b
 * @returns {Number}
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
 * @param {Boolean} a
 * @param {Boolean} b
 * @returns {Number}
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
 * @returns {Number}
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
 * @returns {Number}
 */
export function empty(a, b) {
	return 0;
}
