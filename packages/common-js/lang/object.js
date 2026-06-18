import * as array from './array.js';
import * as is from './is.js';

/**
* Utilities for working with objects.
*
* @public
* @module lang/object
*/

/**
 * Performs "deep" equality check on two objects.
 *
 * Array items are compared, object properties are compared, and
 * "primitive" values are checked using strict equality rules.
 *
 * @static
 * @param {object} a
 * @param {object} b
 * @returns {boolean}
 */
export function equals(a, b) {
	let returnVal;

	if (a === b) {
		returnVal = true;
	} else if (is.array(a) && is.array(b)) {
		if (a.length === b.length) {
			returnVal = a.length === 0 || a.every((x, i) => equals(x, b[i]));
		} else {
			returnVal = false;
		}
	} else if (is.object(a) && is.object(b)) {
		if (is.fn(a.equals) && is.fn(b.equals)) {
			returnVal = a.equals(b);
		} else {
			const keysA = keys(a);
			const keysB = keys(b);

			returnVal = array.differenceSymmetric(keysA, keysB).length === 0 && keysA.every((key) => {
				const valueA = a[key];
				const valueB = b[key];

				return equals(valueA, valueB);
			});
		}
	} else {
		returnVal = false;
	}

	return returnVal;
}

/**
 * Performs a "deep" copy.
 *
 * @static
 * @param {object} source - The object to copy.
 * @param {Function=} canExtract - An optional function which indicates if the "extractor" can be used.
 * @param {Function=} extractor - An optional function which returns a cloned value for a property for assignment to the cloned
 * @returns {object}
 */
export function clone(source, canExtract, extractor) {
	let c;

	if (is.fn(canExtract) && canExtract(source)) {
		c = extractor(source);
	} else if (is.date(source)) {
		c = new Date(source.getTime());
	} else if (is.array(source)) {
		c = source.map((sourceItem) => {
			return clone(sourceItem, canExtract, extractor);
		});
	} else if (is.object(source)) {
		c = keys(source).reduce((accumulator, key) => {
			accumulator[key] = clone(source[key], canExtract, extractor);

			return accumulator;
		}, { });
	} else {
		c = source;
	}

	return c;
}

/**
 * Creates a new object (or array) by performing a deep copy
 * of the properties from each  If the same property
 * exists on both objects, the property value from the
 * second object ("b") is preferred.
 *
 * @static
 * @param {object} a
 * @param {object} b
 * @returns {object}
 */
export function merge(a, b) {
	let m;

	const mergeTarget = is.object(a) && !is.array(a);
	const mergeSource = is.object(b) && !is.array(b);

	if (mergeTarget && mergeSource) {
		const properties = array.unique(keys(a).concat(keys(b)));

		m = properties.reduce((accumulator, property) => {
			accumulator[property] = merge(a[property], b[property]);

			return accumulator;
		}, { });
	} else if (is.undef(b)) {
		m = clone(a);
	} else {
		m = clone(b);
	}

	return m;
}

/**
 * Given an object, returns an array of "own" properties.
 *
 * @static
 * @param {object} target - The object to interrogate.
 * @returns {Array<string>}
 */
export function keys(target) {
	const keys = [];

	for (let k in target) {
		if (Object.prototype.hasOwnProperty.call(target, k)) {
			keys.push(k);
		}
	}

	return keys;
}

/**
 * Given an object, returns a boolean value, indicating if the
 * object has any "own" properties.
 *
 * @static
 * @param {object} target - The object to interrogate.
 * @returns {boolean}
 */
export function empty(target) {
	let empty = true;

	for (let k in target) {
		if (Object.prototype.hasOwnProperty.call(target, k)) {
			empty = false;

			break;
		}
	}

	return empty;
}
