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
		 * <p>Performs "deep" equality check on two objects.</p>
		 *
		 * <p>Array items are compared, object properties are compared, and
		 * finally "primitive" values are checked using strict equality rules.</p>
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
				const keysA = object.keys(a);
				const keysB = object.keys(b);

				returnVal = array.differenceSymmetric(keysA, keysB).length === 0 && keysA.every((key) => {
					const valueA = a[key];
					const valueB = b[key];

					return object.equals(valueA, valueB);
				});
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
		 * @returns {Object}
		 */
		clone(source) {
			let c;

			if (is.array(source)) {
				c = source.map((sourceItem) => {
					return object.clone(sourceItem);
				});
			} else if (is.object(source)) {
				c = object.keys(source).reduce((accumulator, key) => {
					accumulator[key] = object.clone(source[key]);

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
		}
	};

	return object;
})();