module.exports = (() => {
	'use strict';

	/**
	 * A singly linked list. Each instance represents a node in the list,
	 * holding both an item, a reference to the next node.
	 *
	 * @public
	 * @param {*} value - The value of current node.
	 */
	class LinkedList {
		constructor(value) {
			this._value = value;

			this._next = null;
		}

		/**
		 * Returns the value associated with the current node.
		 *
		 * @public
		 * @returns {*}
		 */
		getValue() {
			return this._value;
		}

		/**
		 * Returns the next node, if it exists; otherwise a null value is returned.
		 *
		 * @public
		 * @returns {Tree|null}
		 */
		getNext() {
			return this._next;
		}

		/**
		 * Returns true, if the node is the last one in the list.
		 *
		 * @public
		 * @returns {boolean}
		 */
		getIsTail() {
			return this._next === null;
		}

		/**
		 * Adds (or inserts) a value after the current node and returns
		 * the newly added node.
		 *
		 * @public
		 * @param {*} value
		 * @returns {LinkedList}
		 */
		insert(value) {
			const next = new LinkedList(value);

			if (this._next) {
				next._next = this._next;
			}

			this._next = next;

			return next;
		}

		toString() {
			return '[LinkedList]';
		}
	}

	return LinkedList;
})();