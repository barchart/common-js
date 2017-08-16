const assert = require('./../lang/assert');

module.exports = (() => {
	'use strict';

	/**
	 * A stack collection (supports LIFO operations).
	 *
	 * @public
	 */
	class Stack {
		constructor() {
			this._array = [];
		}

		/**
		 * Adds an item to the stack.
		 *
		 * @public
		 * @param {object} item
		 * @returns {object} - The item added to the stack.
		 */
		push(item) {
			this._array.unshift(item);

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

			return this._array.shift();
		}

		/**
		 * Returns the next item in the stack (without removing it). Throws if the stack is empty.
		 *
		 * @public
		 * @returns {object} - The item added to the queue.
		 */
		peek() {
			if (this.empty()) {
				throw new Error('Stack is empty');
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
		 * Runs an action on each item in the stack.
		 *
		 * @public
		 * @param {Function} action - The action to run.
		 */
		scan(action) {
			assert.argumentIsRequired(action, 'action', Function);

			this._array.forEach(x => action(x));
		}

		/**
		 * Outputs an array of the stacks's items; without affecting the
		 * queue's internal state;
		 *
		 * @public
		 * @returns {Array}
		 */
		toArray() {
			return this._array.slice(0);
		}

		toString() {
			return '[Stack]';
		}
	}

	return Stack;
})();