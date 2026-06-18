import * as assert from './../../lang/assert.js';
import * as is from './../../lang/is.js';

/**
 * A map that which only holds objects for a specified duration.
 *
 * @public
 */
export default class TimeMap {
	#duration;
	#map;

	/**
	 * @param {number} duration - The time to live, in milliseconds.
	 */
	constructor(duration) {
		assert.argumentIsValid(duration, 'duration', x => is.positive(x), 'is positive');

		this.#duration = duration;

		this.#map = { };
	}

	/**
	 * Returns true, if the map contains the item; otherwise false.
	 *
	 * @public
	 * @param {string} key
	 * @returns {boolean}
	 */
	has(key) {
		assert.argumentIsRequired(key, 'key', String);

		let exists = Object.prototype.hasOwnProperty.call(this.#map, key);

		if (exists) {
			const item = this.#map[key];

			if (!item.valid) {
				this.remove(key);

				exists = false;
			}
		}

		return exists;
	}

	/**
	 * Puts an item into the map.
	 *
	 * @public
	 * @param {string} key
	 * @param {*} value
	 */
	put(key, value) {
		assert.argumentIsRequired(key, 'key', String);

		this.#map[key] = new Item(key, value, (new Date().getTime()) + this.#duration);
	}

	/**
	 * Puts an item into the map.
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
		assert.argumentIsRequired(key, 'key', String);

		let returnRef = null;

		if (this.has(key)) {
			returnRef = this.#map[key].value;
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
		assert.argumentIsRequired(key, 'key', String);

		delete this.#map[key];
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
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[TimeMap]';
	}
}

class Item {
	#key;
	#value;
	#expiration;

	constructor(key, value, expiration) {
		this.#key = key;
		this.#value = value;
		this.#expiration = expiration;
	}

	get key() {
		return this.#key;
	}

	get value() {
		return this.#value;
	}

	get valid() {
		return this.#expiration > (new Date().getTime());
	}
}
