const assert = require('./../../lang/assert');

module.exports = (() => {
	'use strict';

	/**
	 * A map that is restricted to a certain capacity. If adding an
	 * item would exceed the capacity; the oldest item is removed.
	 *
	 * @public
	 * @param {Number=} capacity - The maximum number of items the map can contain (defaults to ten).
	 */
	class EvictingMap {
		constructor(capacity) {
			assert.argumentIsOptional(capacity, 'capacity', Number);

			this._capacity = Math.max((capacity || 0), 0) || 10;

			this._map = { };

			this._head = null;
			this._tail = null;

			this._size = 0;
		}

		/**
		 * Returns true, if the map contains the item; otherwise false.
		 *
		 * @public
		 * @param {String} key
		 * @returns {boolean}
		 */
		has(key) {
			return this._map.hasOwnProperty(key);
		}

		/**
		 * Puts an item into the map (possibly causing eviction, if the size of the
		 * list exceeds the capacity).
		 *
		 * @public
		 * @param {*} item
		 */
		put(key, value) {
			this.remove(key);

			let node;

			if (this._head !== null) {
				node = this._head.insertBefore(key);

				this._head = node;
			} else {
				node = new Node(key);

				this._head = node;
				this._tail = node;
			}

			this._map[key] = new Item(node, key, value);

			this._size++;

			while (this._size > this._capacity) {
				this.remove(this._tail.getItem());
			}
		}

		/**
		 * Gets an item from the map, returning a null value if the no item
		 * for the given key exists.
		 *
		 * @public
		 * @param {string} key
		 * @returns {*}
		 */
		get(key) {
			let returnRef;

			const item = this._map[key];

			if (item) {
				returnRef = item.getValue();

				const node = item.getNode();

				if (node !== this._head) {
					if (node === this._tail) {
						this._tail = node._previous;
					}

					node.remove();

					this._head = this._head.insertBefore(key);
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
			const item = this._map[key];

			if (item) {
				const node = item.getNode();

				const next = node.getNext();
				const previous = node.getPrevious();

				node.remove();

				if (this._head === node) {
					this._head = next;
				}

				if (this._tail === node) {
					this._tail = previous;
				}

				delete this._map[key];

				this._size--;
			}
		}

		/**
		 * Returns true, if the map contains no items; otherwise false.
		 *
		 * @public
		 * @param {String} key
		 * @returns {boolean}
		 */
		empty() {
			return this._size === 0;
		}

		/**
		 * Returns the number of items stored in the map.
		 *
		 * @public
		 * @returns {Number}
		 */
		getSize() {
			return this._size;
		}

		/**
		 * The capacity of the map.
		 *
		 * @public
		 * @returns {Number}
		 */
		getCapacity() {
			return this._capacity;
		}

		toString() {
			return '[EvictingMap]';
		}
	}

	class Item {
		constructor(node, key, value) {
			this._node = node;

			this._key = key;
			this._value = value;
		}

		setItem(key, value) {
			this._key = key;
			this._value = value;
		}

		getKey() {
			return this._key;
		}

		getValue() {
			return this._value;
		}

		getNode() {
			return this._node;
		}
	}

	class Node {
		constructor(item) {
			this._item = item;

			this._previous = null;
			this._next = null;
		}

		insertBefore(item) {
			const node = new Node(item);

			node._next = this;

			if (this._previous !== null) {
				node._previous = this._previous;
				this._previous._next = node;
			}

			this._previous = node;

			return node;
		}

		insertAfter(item) {
			const node = new Node(item);

			node._previous = this;

			if (this._next !== null) {
				node._next = this._next;
				this._next._previous = node;
			}

			this._next = node;

			return node;
		}

		remove() {
			const next = this._next;
			const previous = this._previous;

			this._next = null;
			this._previous = null;

			if (next && previous) {
				previous._next = next;
				next._previous = previous;
			} else if (next) {
				next._previous = null;
			} else if (previous) {
				previous._next = null;
			}

			return this;
		}

		getItem() {
			return this._item;
		}

		hasNext() {
			return this._next !== null;
		}

		getNext() {
			return this._next;
		}

		hasPrevious() {
			return this._previous !== null;
		}

		getPrevious() {
			return this._previous;
		}
	}

	return EvictingMap;
})();