const assert = require('./../../lang/assert'),
	Queue = require('./../Queue');

module.exports = (() => {
	'use strict';

	/**
	 * A queue that sorts items as they are inserted.
	 *
	 * This implementation has not been optimized for performance. It uses
	 * the native Array sort implementation an may result in n-squared
	 * insert performance.
	 *
	 * @public
	 * @extends {Queue}
	 */
	class PriorityQueue extends Queue {
		constructor(comparator) {
			super();

			assert.argumentIsRequired(comparator, 'comparator', Function);

			this._comparator = comparator;
		}

		/**
		 * Adds one item to the queue.
		 *
		 * @public
		 * @param {Object} item
		 * @return {Object}
		 */
		enqueue(item) {
			if (this._array.length === 0 || !(this._comparator(item, this._array[this._array.length - 1]) < 0)) {
				this._array.push(item);
			} else if (this._comparator(item, this._array[0]) < 0) {
				this._array.unshift(item);
			} else {
				this._array.splice(binarySearch(this._array, item, this._comparator, 0, this._array.length - 1), 0, item);
			}

			return item;
		}

		dequeue() {
			return super.dequeue();
		}

		peek() {
			return super.peek();
		}

		scan(action) {
			return super.scan(action);
		}

		toArray() {
			return super.toArray();
		}

		toString() {
			return '[PriorityQueue]';
		}
	}

	function binarySearch(array, item, comparator, start, end) {
		const size = end - start;

		const midpointIndex = start + Math.floor(size / 2);
		const midpointItem = array[ midpointIndex ];

		const comparison = (comparator(item, midpointItem) > 0);

		if (size < 2) {
			if (comparison > 0) {
				const finalIndex = array.length - 1;

				if (end === finalIndex && comparator(item, array[ finalIndex ]) > 0) {
					return end + 1;
				} else {
					return end;
				}
			} else {
				return start;
			}
		} else if (comparison > 0) {
			return binarySearch(array, item, comparator, midpointIndex, end);
		} else {
			return binarySearch(array, item, comparator, start, midpointIndex);
		}
	}

	return PriorityQueue;
})();
