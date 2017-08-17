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
			this._dirty = false;
		}

		enqueue(item) {
			this._array.push(item);

			this._dirty = true;

			return item;
		}

		dequeue() {
			checkSortQueue.call(this);

			return super.dequeue();
		}

		peek() {
			checkSortQueue.call(this);

			return super.peek();
		}

		scan(action) {
			checkSortQueue.call(this);

			return super.scan(action);
		}

		toArray() {
			checkSortQueue.call(this);

			return super.toArray();
		}

		toString() {
			return '[PriorityQueue]';
		}
	}

	function checkSortQueue() {
		if (this._dirty) {
			this._array.sort(this._comparator);
			this._dirty = false;
		}
	}

	return PriorityQueue;
})();
