/**
 * Converts a value into a Date instance.
 *
 * @public
 * @param {*} object
 * @returns {Date}
 */
export function toDate(object) {
	return new Date(object);
}

/**
 * Returns a value without applying any conversion.
 *
 * @public
 * @param {*} object
 * @returns {*}
 */
export function empty(object) {
	return object;
}
