import * as assert from './../lang/assert.js';

/**
 * A stack collection (supports LIFO operations).
 *
 * @public
 */
export default class Stack {
	#array;

	constructor() {
		this.#array = [ ];
	}

	/**
	 * Adds an item to the stack.
	 *
	 * @public
	 * @param {object} item
	 * @returns {object} - The item added to the stack.
	 */
	push(item) {
		this.#array.push(item);

		return item;
	}

	/**
	 * Removes and returns an item from the stack. Throws if the stack is empty.
	 *
	 * @public
	 * @returns {object} - The removed from the stack.
	 */
	pop() {
		if (this.empty()) {
			throw new Error('Stack is empty');
		}

		return this.#array.pop();
	}

	/**
	 * Returns the next item in the stack (without removing it). Throws if the stack is empty.
	 *
	 * @public
	 * @returns {object} - The item added to the stack.
	 */
	peek() {
		if (this.empty()) {
			throw new Error('Stack is empty');
		}

		return this.#array[this.#array.length - 1];
	}

	/**
	 * Returns true if the stack is empty; otherwise false.
	 *
	 * @public
	 * @returns {boolean}
	 */
	empty() {
		return this.#array.length === 0;
	}

	/**
	 * Runs an action on each item in the stack.
	 *
	 * @public
	 * @param {Function} action - The action to run.
	 */
	scan(action) {
		assert.argumentIsRequired(action, 'action', Function);

		for (let i = this.#array.length - 1; i >= 0; i--) {
			action(this.#array[i]);
		}
	}

	/**
	 * Outputs an array of the stack's items; without affecting the
	 * stack's internal state;
	 *
	 * @public
	 * @returns {Array}
	 */
	toArray() {
		return this.#array.slice(0).reverse();
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[Stack]';
	}
}
