import * as assert from './assert.js';

/**
 * Returns a random integer within a given range.
 *
 * @public
 * @param {number} minimum - The minimum value (inclusive).
 * @param {number} maximum - The maximum value (exclusive).
 * @returns {number}
 */
export function range(minimum, maximum) {
	assert.argumentIsRequired(minimum, 'minimum', Number);
	assert.argumentIsRequired(maximum, 'maximum', Number);

	const mn = Math.trunc(minimum);
	const mx = Math.trunc(maximum);

	return Math.min(mn, mx) + Math.floor(Math.random() * Math.abs(mx - mn));
}
