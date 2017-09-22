const assert = require('./assert'),
	is = require('./is');

module.exports = (() => {
	'use strict';

	/**
	 * Utilities for working with arrays.
	 *
	 * @public
	 * @module lang/array
	 */
	return {
		/**
		 * Returns the unique items from an array, where the unique
		 * key is determined via a strict equality check.
		 *
		 * @static
		 * @param {Array} a
		 * @returns {Array}
		 */
		unique(a) {
			assert.argumentIsArray(a, 'a');

			return a.filter((item, index, array) => {
				return array.indexOf(item) === index;
			});
		},

		/**
		 * Returns the unique items from an array, where the unique
		 * key is determined by a delegate.
		 *
		 * @static
		 * @param {Array} a
		 * @param {Function} keySelector - The function, when applied to an item yields a unique key.
		 * @returns {Array}
		 */
		uniqueBy(a, keySelector) {
			assert.argumentIsArray(a, 'a');

			return a.filter((item, index, array) => {
				const key = keySelector(item);

				return array.findIndex(candidate => key === keySelector(candidate)) === index;
			});
		},

		/**
		 * Splits array into groups and returns an object (where the properties have
		 * arrays). Unlike the indexBy function, there can be many items
		 * which share the same key.
		 *
		 * @static
		 * @param {Array} a
		 * @param {Function} keySelector - The function, when applied to an item yields a key.
		 * @returns {Object}
		 */
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

		/**
		 * Splits array into groups and returns an array of arrays where the items of each
		 * nested array share a common key.
		 *
		 * @static
		 * @param {Array} a
		 * @param {Function} keySelector - The function, when applied to an item yields a key.
		 * @returns {Array}
		 */
		batchBy(a, keySelector) {
			assert.argumentIsArray(a, 'a');
			assert.argumentIsRequired(keySelector, 'keySelector', Function);

			let currentKey = null;
			let currentBatch = null;

			return a.reduce((batches, item) => {
				const key = keySelector(item);

				if (currentBatch === null || currentKey !== key) {
					currentKey = key;

					currentBatch = [];
					batches.push(currentBatch);
				}

				currentBatch.push(item);

				return batches;
			}, []);
		},

		/**
		 * Splits array into groups and returns an object (where the properties are items from the
		 * original array). Unlike the groupBy, Only one item can have a given key
		 * value.
		 *
		 * @static
		 * @param {Array} a
		 * @param {Function} keySelector - The function, when applied to an item yields a unique key.
		 * @returns {Object}
		 */
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

		/**
		 * Returns a new array containing all but the last item.
		 *
		 * @static
		 * @param {Array} a
		 * @returns {Array}
		 */
		dropRight(a) {
			assert.argumentIsArray(a, 'a');

			let returnRef = Array.from(a);

			if (returnRef.length !== 0) {
				returnRef.pop();
			}

			return returnRef;
		},

		/**
		 * Returns the last item from an array, or an undefined value, if the
		 * array is empty.
		 *
		 * @static
		 * @param {Array} a
		 * @returns {*|undefined}
		 */
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

		/**
		 * Returns a copy of an array, replacing any item that is itself an array
		 * with the item's items.
		 *
		 * @static
		 * @param {Array} a
		 * @param {Boolean=} recursive - If true, all nested arrays will be flattened.
		 * @returns {Array}
		 */
		flatten(a, recursive) {
			assert.argumentIsArray(a, 'a');
			assert.argumentIsOptional(recursive, 'recursive', Boolean);

			const empty = [];

			let flat = empty.concat.apply(empty, a);

			if (recursive && flat.some(x => is.array(x))) {
				flat = this.flatten(flat, true);
			}

			return flat;
		},

		/**
		 * Breaks an array into smaller arrays, returning an array of arrays.
		 *
		 * @static
		 * @param {Array} a
		 * @param {Number} size - The maximum number of items per partition.
		 * @param {Array<Array>}
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
		 * @static
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

		/**
		 * Set symmetric difference operation (using strict equality). In
		 * other words, this is the union of the differences between the
		 * sets.
		 *
		 * @static
		 * @param {Array} a
		 * @param {Array} b
		 * @returns {Array}
		 */
		differenceSymmetric(a, b) {
			return this.union(this.difference(a, b), this.difference(b, a));
		},

		/**
		 * Set union operation (using strict equality).
		 *
		 * @static
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
		 * @static
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
})();