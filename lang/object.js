const array = require('./array'),
	is = require('./is');

module.exports = (() => {
	'use strict';

	const object = {
		/**
		 * <p>Performs "deep" equality check on two objects.</p>
		 *
		 * <p>Array items are compared, object properties are compared, and
		 * finally "primitive" values are checked using strict equality rules.</p>
		 *
		 * @param a
		 * @param b
		 *
		 * @returns {Boolean}
		 */
		equals(a, b) {
			let returnVal;

			if (a === b) {
				returnVal = true
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
		 * @returns {Object}
		 */
		clone(target) {
			let c;

			if (is.array(target)) {
				c = target.map((targetItem) => {
					return object.clone(targetItem);
				});
			} else if (is.object(target)) {
				c = object.keys(target).reduce((accumulator, key) => {
					accumulator[key] = object.clone(target[key]);

					return accumulator;
				}, { });
			} else {
				c = target;
			}

			return c;
		},

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