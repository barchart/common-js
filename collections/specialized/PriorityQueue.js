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

		enqueue(item) {
			if (this._array.length === 0 || !(this._comparator(item, this._array[this._array.length - 1]) < 0)) {
				this._array.push(item);
			} else if (this._comparator(item, this._array[0]) < 0) {
				this._array.unshift(item);
			} else {
				this._array.splice(this._array.findIndex(i => this._comparator(item, i) < 0), 0, item);
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

	return PriorityQueue;
})();
