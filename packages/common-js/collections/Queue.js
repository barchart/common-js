import * as assert from './../lang/assert.js';

/**
 * A queue collection that supports FIFO operations.
 *
 * @public
 */
export default class Queue {
	#array;

	constructor() {
		this.#array = [ ];
	}

	/**
	 * Adds an item to the end of the queue.
	 *
	 * @public
	 * @param {*} item - The item to add.
	 * @returns {*} The item added to the queue.
	 */
	enqueue(item) {
		this.#array.push(item);

		return item;
	}

	/**
	 * Removes the next item from the queue and returns it. Throws if the queue is empty.
	 *
	 * @public
	 * @returns {*} The item removed from the queue.
	 * @throws {Error} If the queue is empty.
	 */
	dequeue() {
		if (this.empty()) {
			throw new Error('Queue is empty');
		}

		return this.#array.shift();
	}

	/**
	 * Returns the next item in the queue without removing it.
	 *
	 * @public
	 * @returns {*} The next item in the queue.
	 * @throws {Error} If the queue is empty.
	 */
	peek() {
		if (this.empty()) {
			throw new Error('Queue is empty');
		}

		return this.#array[0];
	}

	/**
	 * Indicates whether the queue is empty.
	 *
	 * @public
	 * @returns {boolean} True if the queue is empty; otherwise, false.
	 */
	empty() {
		return this.#array.length === 0;
	}

	/**
	 * Runs an action on each item in the queue.
	 *
	 * @public
	 * @param {Function} action - The action to run.
	 */
	scan(action) {
		assert.argumentIsRequired(action, 'action', Function);

		this.#array.forEach(item => action(item));
	}

	/**
	 * Returns a copy of the queue's items without affecting its internal state.
	 *
	 * @public
	 * @returns {Array<*>} A copy of the queue's items.
	 */
	toArray() {
		return this.#array.slice(0);
	}

	/**
	 * Returns the queue's internal array for use by derived classes.
	 *
	 * @protected
	 * @returns {Array<*>} The internal array.
	 */
	_getArray() {
		return this.#array;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[Queue]';
	}
}