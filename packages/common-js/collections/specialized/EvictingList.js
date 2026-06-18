import * as assert from './../../lang/assert.js';

const empty = { };

/**
 * A list that is restricted to a certain capacity. If adding an
 * item would exceed the capacity; the oldest item is removed.
 *
 * @public
 */
export default class EvictingList {
	#capacity;
	#array;
	#head;

	/**
	 * @param {number=} capacity - The maximum number of items the list can contain (defaults to ten).
	 */
	constructor(capacity) {
		assert.argumentIsOptional(capacity, 'capacity', Number);

		this.#capacity = Math.max((capacity || 0), 0) || 10;

		this.#array = [ ];

		for (let i = 0; i < this.#capacity; i++) {
			this.#array[i] = empty;
		}

		this.#head = null;
	}

	/**
	 * Adds an item to the list (possibly causing eviction, if the size of the
	 * list exceeds the capacity).
	 *
	 * @public
	 * @param {*} item
	 */
	add(item) {
		this.#array[this.#head = getNextIndex(this.#head, this.#capacity)] = item;
	}

	/**
	 * Returns the first item in the list, throwing an error if the list is empty.
	 *
	 * @public
	 * @returns {*}
	 */
	peek() {
		if (this.empty()) {
			throw new Error('EvictingList is empty');
		}

		return this.#array[this.#head];
	}

	/**
	 * Returns true, if the list is empty; otherwise false.
	 *
	 * @public
	 * @returns {boolean}
	 */
	empty() {
		return this.#head === null;
	}

	/**
	 * The capacity of the list.
	 *
	 * @public
	 * @returns {number}
	 */
	getCapacity() {
		return this.#capacity;
	}

	/**
	 * Copies the items in the list to a new array.
	 *
	 * @returns {Array}
	 */
	toArray() {
		let returnRef = [ ];

		if (!this.empty()) {
			let current = this.#head;

			for (let i = 0; i < this.#capacity; i++) {
				const item = this.#array[current];

				if (item === empty) {
					break;
				}

				returnRef.push(item);

				current = getPreviousIndex(current, this.#capacity);
			}
		}

		return returnRef;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[EvictingList]';
	}
}

const getNextIndex = (current, capacity) => {
	let returnVal;

	if (current === null) {
		returnVal = 0;
	} else {
		returnVal = current + 1;

		if (returnVal === capacity) {
			returnVal = 0;
		}
	}

	return returnVal;
};

const getPreviousIndex = (current, capacity) => {
	let returnVal;

	if (current === null) {
		returnVal = 0;
	} else {
		returnVal = current - 1;

		if (returnVal < 0) {
			returnVal = capacity -1;
		}
	}

	return returnVal;
};
