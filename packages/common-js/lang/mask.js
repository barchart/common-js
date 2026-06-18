import * as assert from './assert.js';
import * as is from './is.js';

/**
 * Returns an empty bit mask.
 *
 * @public
 * @returns {number}
 */
export function getEmpty() {
	return 0;
}

/**
 * Adds a single-bit item to an existing bit mask.
 *
 * @public
 * @param {number} existing
 * @param {number} itemToAdd
 * @returns {number}
 */
export function add(existing, itemToAdd) {
	assert.argumentIsRequired(existing, 'existing', Number);
	assert.argumentIsRequired(itemToAdd, 'itemToAdd', Number);

	if (checkItem(itemToAdd)) {
		return existing | itemToAdd;
	} else {
		return existing;
	}
}

/**
 * Removes a single-bit item from an existing bit mask.
 *
 * @public
 * @param {number} existing
 * @param {number} itemToRemove
 * @returns {number}
 */
export function remove(existing, itemToRemove) {
	assert.argumentIsRequired(existing, 'existing', Number);
	assert.argumentIsRequired(itemToRemove, 'itemToRemove', Number);

	if (checkItem(itemToRemove)) {
		return existing & ~itemToRemove;
	} else {
		return existing;
	}
}

/**
 * Indicates whether an existing bit mask contains a single-bit item.
 *
 * @public
 * @param {number} existing
 * @param {number} itemToCheck
 * @returns {boolean}
 */
export function has(existing, itemToCheck) {
	assert.argumentIsRequired(existing, 'existing', Number);
	assert.argumentIsRequired(itemToCheck, 'itemToCheck', Number);

	return checkItem(itemToCheck) && (existing & itemToCheck) === itemToCheck;
}

/**
 * Indicates whether a value can be used as a single-bit mask item.
 *
 * @public
 * @param {number} itemToCheck
 * @returns {boolean}
 */
export function checkItem(itemToCheck) {
	return is.number(itemToCheck) && (itemToCheck === 0 || ((itemToCheck & (~itemToCheck + 1)) === itemToCheck));
}
