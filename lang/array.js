const assert = require('./assert');

module.exports = (() => {
	'use strict';

	const array = {
		unique(a) {
			assert.argumentIsArray(a, 'a');

			return a.filter((item, index, array) => {
				return array.indexOf(item) === index;
			});
		},

		groupBy(a, keySelector) {
			assert.argumentIsArray(a, 'a');
			assert.argumentIsRequired(keySelector, 'keySelector', Function);

			return a.reduce((groups, item) => {
				const key = keySelector(item);

				if (!groups.hasOwnProperty(key)) {
					groups[key] = [ ];
				}

				groups[key].push(item);

				return groups;
			}, { });
		},

		indexBy(a, keySelector) {
			assert.argumentIsArray(a, 'a');
			assert.argumentIsRequired(keySelector, 'keySelector', Function);

			return a.reduce((map, item) => {
				const key = keySelector(item);

				if (map.hasOwnProperty(key)) {
					throw new Error('Unable to index array. A duplicate key exists.');
				}

				map[key] = item;

				return map;
			}, { });
		},

		dropRight(a) {
			let returnRef = Array.from(a);

			if (returnRef.length !== 0) {
				returnRef.pop();
			}

			return returnRef;
		},

		last(a) {
			let returnRef;

			if (a.length !== 0) {
				returnRef = a[a.length - 1];
			} else {
				returnRef = undefined;
			}

			return returnRef;
		},

		/**
		 * Set difference operation (using strict equality).
		 *
		 * @param {Array} a
		 * @param {Array} b
		 * @returns {Array}
		 */
		difference(a, b) {
			const returnRef = [ ];

			a.forEach((candidate) => {
				const exclude = b.some((comparison) => {
					return candidate === comparison;
				});

				if (!exclude) {
					returnRef.push(candidate);
				}
			});

			return returnRef;
		},

		differenceSymmetric(a, b) {
			return array.union(array.difference(a, b), array.difference(b, a));
		},

		/**
		 * Set union operation (using strict equality).
		 *
		 * @param {Array} a
		 * @param {Array} b
		 * @returns {Array}
		 */
		union(a, b) {
			const returnRef = a.slice();

			b.forEach((candidate) => {
				const exclude = returnRef.some((comparison) => {
					return candidate === comparison;
				});

				if (!exclude) {
					returnRef.push(candidate);
				}
			});

			return returnRef;
		},

		/**
		 * Set intersection operation (using strict equality).
		 *
		 * @param {Array} a
		 * @param {Array} b
		 * @returns {Array}
		 */
		intersection(a, b) {
			const returnRef = [ ];

			a.forEach((candidate) => {
				const include = b.some((comparison) => {
					return candidate === comparison;
				});

				if (include) {
					returnRef.push(candidate);
				}
			});

			return returnRef;
		}
	};

	return array;
})();