const assert = require('./../lang/assert');

module.exports = (() => {
	'use strict';

	/**
	 * A queue collection (i.e. supports FIFO operations).
	 *
	 * @public
	 */
	class Queue {
		constructor() {
			this._array = [];
		}

		/**
		 * Adds an item to the queue.
		 *
		 * @public
		 * @param {object} item
		 * @returns {object} - The item added to the queue.
		 */
		enqueue(item) {
			this._array.push(item);

			return item;
		}

		/**
		 * Removes the next item from the queue and returns it. Throws if the queue is empty.
		 *
		 * @public
		 * @returns {object} - The item added to the queue.
		 */
		dequeue() {
			if (this.empty()) {
				throw new Error('Queue is empty');
			}

			return this._array.shift();
		}

		/**
		 * Returns the next item in the queue (without removing it). Throws if the queue is empty.
		 *
		 * @public
		 * @returns {object} - The item added to the queue.
		 */
		peek() {
			if (this.empty()) {
				throw new Error('Queue is empty');
			}

			return this._array[0];
		}

		/**
		 * Returns true if the queue is empty; otherwise false.
		 *
		 * @public
		 * @returns {boolean}
		 */
		empty() {
			return this._array.length === 0;
		}

		/**
		 * Runs an action on each item in the queue.
		 *
		 * @public
		 * @param {Function} action - The action to run.
		 */
		scan(action) {
			assert.argumentIsRequired(action, 'action', Function);

			this._array.forEach(x => action(x));
		}

		/**
		 * Outputs an array of the queue's items; without affecting the
		 * queue's internal state;
		 *
		 * @public
		 * @returns {Array}
		 */
		toArray() {
			return this._array.slice(0);
		}

		toString() {
			return '[Queue]';
		}
	}

	return Queue;
})();
