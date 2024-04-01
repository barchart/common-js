const assert = require('./../../lang/assert'),
	is = require('./../../lang/is');

module.exports = (() => {
	'use strict';

	/**
	 * A map that which only holds objects for a specified duration.
	 *
	 * @public
	 * @param {Number} duration - The time to live, in milliseconds.
	 */
	class TimeMap {
		constructor(duration) {
			assert.argumentIsValid(duration, 'duration', x => is.positive(x), 'is positive');

			this._duration = duration;

			this._map = { };
		}

		/**
		 * Returns true, if the map contains the item; otherwise false.
		 *
		 * @public
		 * @param {String} key
		 * @returns {boolean}
		 */
		has(key) {
			assert.argumentIsRequired(key, 'key', String);

			let exists = this._map.hasOwnProperty(key);

			if (exists) {
				const item = this._map[key];

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
		 * @param {String} key
		 * @param {*} value
		 */
		put(key, value) {
			assert.argumentIsRequired(key, 'key', String);

			this._map[key] = new Item(key, value, (new Date().getTime()) + this._duration);
		}

		/**
		 * Puts an item into the map.
		 *
		 * @public
		 * @param {String} key
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
		 * @param {String} key
		 * @returns {*|null}
		 */
		get(key) {
			assert.argumentIsRequired(key, 'key', String);

			let returnRef = null;

			if (this.has(key)) {
				returnRef = this._map[key].value;
			}

			return returnRef;
		}

		/**
		 * Removes an item from the map.
		 *
		 * @public
		 * @param {String} key
		 */
		remove(key) {
			assert.argumentIsRequired(key, 'key', String);

			delete this._map[key];
		}

		/**
		 * Removes an item from the map.
		 *
		 * @public
		 * @param {String} key
		 */
		delete(key) {
			this.remove(key);
		}

		toString() {
			return '[TimeMap]';
		}
	}

	class Item {
		constructor(key, value, expiration) {
			this._key = key;
			this._value = value;
			this._expiration = expiration;
		}

		get key() {
			return this._key;
		}

		get value() {
			return this._value;
		}

		get valid() {
			return this._expiration > (new Date().getTime());
		}
	}

	return TimeMap;
})();