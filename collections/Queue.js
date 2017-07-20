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

		toString() {
			return '[Queue]';
		}
	}

	return Queue;
})();
