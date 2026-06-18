/**
 * A singly linked list. Each instance represents a node in the list,
 * holding both an item, a reference to the next node.
 *
 * @public
 */
export default class LinkedList {
	#value;
	#next;

	/**
	 * @param {*} value - The value of current node.
	 */
	constructor(value) {
		this.#value = value;

		this.#next = null;
	}

	/**
	 * Returns the value associated with the current node.
	 *
	 * @public
	 * @returns {*}
	 */
	getValue() {
		return this.#value;
	}

	/**
	 * Returns the next node, if it exists; otherwise a null value is returned.
	 *
	 * @public
	 * @returns {LinkedList|null}
	 */
	getNext() {
		return this.#next;
	}

	/**
	 * Returns true, if the node is the last one in the list.
	 *
	 * @public
	 * @returns {boolean}
	 */
	getIsTail() {
		return this.#next === null;
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

		if (this.#next) {
			next.#next = this.#next;
		}

		this.#next = next;

		return next;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[LinkedList]';
	}
}
