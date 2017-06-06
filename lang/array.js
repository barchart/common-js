const assert = require('./assert');
const is = require('./is');

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
			assert.argumentIsArray(a, 'a');

			let returnRef = Array.from(a);

			if (returnRef.length !== 0) {
				returnRef.pop();
			}

			return returnRef;
		},

		last(a) {
			assert.argumentIsArray(a, 'a');

			let returnRef;

			if (a.length !== 0) {
				returnRef = a[a.length - 1];
			} else {
				returnRef = undefined;
			}

			return returnRef;
		},

		flatten(a, recursive) {
			assert.argumentIsArray(a, 'a');
			assert.argumentIsOptional(recursive, 'recursive', Boolean);

			const empty = [];

			let flat = empty.concat.apply(empty, a);

			if (recursive && flat.some(x => is.array(x))) {
				flat = array.flatten(flat, true);
			}

			return flat;
		},

		/**
		 * Breaks an array into smaller arrays.
		 *
		 * @param a
		 * @param size
		 */
		partition(a, size) {
			assert.argumentIsArray(a, 'a');
			assert.argumentIsOptional(size, 'size', Number);

			const copy = a.slice(0);
			const partitions = [ ];

			while (copy.length !== 0) {
				partitions.push(copy.splice(0, size));
			}

			return partitions;
		},

		/**
		 * Set difference operation (using strict equality).
		 *
		 * @param {Array} a
		 * @param {Array} b
		 * @returns {Array}
		 */
		difference(a, b) {
			assert.argumentIsArray(a, 'a');
			assert.argumentIsArray(b, 'b');

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
			assert.argumentIsArray(a, 'a');
			assert.argumentIsArray(b, 'b');

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
			assert.argumentIsArray(a, 'a');
			assert.argumentIsArray(b, 'b');

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