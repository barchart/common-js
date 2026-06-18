import * as assert from './../../lang/assert.js';

/**
 * A map that is restricted to a certain capacity. If adding an
 * item would exceed the capacity; the oldest item is removed.
 *
 * @public
 */
export default class EvictingMap {
	#capacity;
	#map;
	#head;
	#tail;
	#size;

	/**
	 * @param {number=} capacity - The maximum number of items the map can contain (defaults to ten).
	 */
	constructor(capacity) {
		assert.argumentIsOptional(capacity, 'capacity', Number);

		this.#capacity = Math.max((capacity || 0), 0) || 10;

		this.#map = { };

		this.#head = null;
		this.#tail = null;

		this.#size = 0;
	}

	/**
	 * Returns true, if the map contains the item; otherwise false.
	 *
	 * @public
	 * @param {string} key
	 * @returns {boolean}
	 */
	has(key) {
		return this.#map.hasOwnProperty(key);
	}

	/**
	 * Puts an item into the map (possibly causing eviction, if the size of the
	 * list exceeds the capacity).
	 *
	 * @public
	 * @param {string} key
	 * @param {*} value
	 */
	put(key, value) {
		this.remove(key);

		let node;

		if (this.#head !== null) {
			node = this.#head.insertBefore(key);

			this.#head = node;
		} else {
			node = new Node(key);

			this.#head = node;
			this.#tail = node;
		}

		this.#map[key] = new Item(node, key, value);

		this.#size++;

		while (this.#size > this.#capacity) {
			this.remove(this.#tail.getItem());
		}
	}

	/**
	 * Puts an item into the map (possibly causing eviction, if the size of the
	 * list exceeds the capacity).
	 *
	 * @public
	 * @param {string} key
	 * @param {*} value
	 */
	set(key, value) {
		this.put(key, value);
	}

	/**
	 * Gets an item from the map, returning a null value if the no item
	 * for the given key exists.
	 *
	 * @public
	 * @param {string} key
	 * @returns {*|null}
	 */
	get(key) {
		let returnRef;

		const item = this.#map[key];

		if (item) {
			returnRef = item.getValue();

			const node = item.getNode();

			if (node !== this.#head) {
				if (node === this.#tail) {
					this.#tail = node.getPrevious();
				}

				node.remove();

				this.#head = this.#head.insertBefore(key);

				item.setNode(this.#head);
			}
		} else {
			returnRef = null;
		}

		return returnRef;
	}

	/**
	 * Removes an item from the map.
	 *
	 * @public
	 * @param {string} key
	 */
	remove(key) {
		const item = this.#map[key];

		if (item) {
			const node = item.getNode();

			const next = node.getNext();
			const previous = node.getPrevious();

			node.remove();

			if (this.#head === node) {
				this.#head = next;
			}

			if (this.#tail === node) {
				this.#tail = previous;
			}

			delete this.#map[key];

			this.#size--;
		}
	}

	/**
	 * Removes an item from the map.
	 *
	 * @public
	 * @param {string} key
	 */
	delete(key) {
		this.remove(key);
	}

	/**
	 * Returns true, if the map contains no items; otherwise false.
	 *
	 * @public
	 * @returns {boolean}
	 */
	empty() {
		return this.#size === 0;
	}

	/**
	 * Returns the number of items stored in the map.
	 *
	 * @public
	 * @returns {number}
	 */
	getSize() {
		return this.#size;
	}

	/**
	 * The capacity of the map.
	 *
	 * @public
	 * @returns {number}
	 */
	getCapacity() {
		return this.#capacity;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[EvictingMap]';
	}
}

class Item {
	#node;
	#key;
	#value;

	constructor(node, key, value) {
		this.#node = node;

		this.#key = key;
		this.#value = value;
	}

	getKey() {
		return this.#key;
	}

	getValue() {
		return this.#value;
	}

	getNode() {
		return this.#node;
	}

	setNode(node) {
		this.#node = node;
	}
}

class Node {
	#item;
	#previous;
	#next;

	constructor(item) {
		this.#item = item;

		this.#previous = null;
		this.#next = null;
	}

	insertBefore(item) {
		const node = new Node(item);

		node.#next = this;

		if (this.#previous !== null) {
			node.#previous = this.#previous;
			this.#previous.#next = node;
		}

		this.#previous = node;

		return node;
	}

	insertAfter(item) {
		const node = new Node(item);

		node.#previous = this;

		if (this.#next !== null) {
			node.#next = this.#next;
			this.#next.#previous = node;
		}

		this.#next = node;

		return node;
	}

	remove() {
		const next = this.#next;
		const previous = this.#previous;

		this.#next = null;
		this.#previous = null;

		if (next && previous) {
			previous.#next = next;
			next.#previous = previous;
		} else if (next) {
			next.#previous = null;
		} else if (previous) {
			previous.#next = null;
		}

		return this;
	}

	getItem() {
		return this.#item;
	}

	hasNext() {
		return this.#next !== null;
	}

	getNext() {
		return this.#next;
	}

	hasPrevious() {
		return this.#previous !== null;
	}

	getPrevious() {
		return this.#previous;
	}
}
