const array = require('./array'),
	is = require('./is');

module.exports = (() => {
	'use strict';

	/**
	 * Utilities for working with objects.
	 *
	 * @public
	 * @module lang/object
	 */
	const object = {
		/**
		 * Performs "deep" equality check on two objects.
		 *
		 * Array items are compared, object properties are compared, and
		 * "primitive" values are checked using strict equality rules.
		 *
		 * @static
		 * @param {Object} a
		 * @param {Object} b
		 * @returns {Boolean}
		 */
		equals(a, b) {
			let returnVal;

			if (a === b) {
				returnVal = true;
			} else if (is.array(a) && is.array(b)) {
				if (a.length === b.length) {
					returnVal = a.length === 0 || a.every((x, i) => object.equals(x, b[i]));
				} else {
					returnVal = false;
				}
			} else if (is.object(a) && is.object(b)) {
				if (is.fn(a.equals) && is.fn(b.equals)) {
					returnVal = a.equals(b);
				} else {
					const keysA = object.keys(a);
					const keysB = object.keys(b);

					returnVal = array.differenceSymmetric(keysA, keysB).length === 0 && keysA.every((key) => {
						const valueA = a[key];
						const valueB = b[key];

						return object.equals(valueA, valueB);
					});
				}
			} else {
				returnVal = false;
			}

			return returnVal;
		},

		/**
		 * Performs a "deep" copy.
		 *
		 * @static
		 * @param {Object} source - The object to copy.
		 * @param {Function=} canExtract - An optional function which indicates if the "extractor" can be used.
		 * @param {Function=} extractor - An optional function which returns a cloned value for a property for assignment to the cloned object.
		 * @returns {Object}
		 */
		clone(source, canExtract, extractor) {
			let c;

			if (is.fn(canExtract) && canExtract(source)) {
				c = extractor(source);
			} else if (is.date(source)) {
				c = new Date(source.getTime());
			} else if (is.array(source)) {
				c = source.map((sourceItem) => {
					return object.clone(sourceItem, canExtract, extractor);
				});
			} else if (is.object(source)) {
				c = object.keys(source).reduce((accumulator, key) => {
					accumulator[key] = object.clone(source[key], canExtract, extractor);

					return accumulator;
				}, { });
			} else {
				c = source;
			}

			return c;
		},

		/**
		 * Creates a new object (or array) by performing a deep copy
		 * of the properties from each object. If the same property
		 * exists on both objects, the property value from the
		 * second object ("b") is preferred.
		 *
		 * @static
		 * @param {Object} a
		 * @param {Object} b
		 * @returns {Object}
		 */
		merge(a, b) {
			let m;

			const mergeTarget = is.object(a) && !is.array(a);
			const mergeSource = is.object(b) && !is.array(b);

			if (mergeTarget && mergeSource) {
				const properties = array.unique(object.keys(a).concat(object.keys(b)));

				m = properties.reduce((accumulator, property) => {
					accumulator[property] = object.merge(a[property], b[property]);

					return accumulator;
				}, { });
			} else if (is.undefined(b)) {
				m = object.clone(a);
			} else {
				m = object.clone(b);
			}

			return m;
		},

		/**
		 * Given an object, returns an array of "own" properties.
		 *
		 * @static
		 * @param {Object} target - The object to interrogate.
		 * @returns {Array<string>}
		 */
		keys(target) {
			const keys = [];

			for (let k in target) {
				if (target.hasOwnProperty(k)) {
					keys.push(k);
				}
			}

			return keys;
		},

		/**
		 * Given an object, returns a Boolean value, indicating if the
		 * object has any "own" properties.
		 *
		 * @static
		 * @param {Object} target - The object to interrogate.
		 * @returns {Boolean}
		 */
		empty(target) {
			let empty = true;

			for (let k in target) {
				if (target.hasOwnProperty(k)) {
					empty = false;

					break;
				}
			}

			return empty;
		}
	};

	return object;
})();