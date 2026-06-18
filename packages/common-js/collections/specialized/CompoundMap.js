import * as assert from './../../lang/assert.js';
import * as is from './../../lang/is.js';

/**
 * A map that stores data using a compound key -- without the need
 * to implement objects needing to implement equals and hashcode.
 *
 * @public
 */
export default class CompoundMap {
	#depth;
	#map;

	/**
	 * @param {number} depth - The number of keys.
	 */
	constructor(depth) {
		assert.argumentIsRequired(depth, 'depth', Number);

		this.#depth = depth;

		this.#map = { };
	}

	/**
	 * Returns true if the map has a value (or a grouping of values) at the
	 * given key.
	 *
	 * @public
	 * @param {...string} keys
	 * @returns {boolean}
	 */
	has(...keys) {
		validateKeys(keys, this.#depth, false);

		let target = this.#map;

		return keys.every((k) => {
			const returnVal = target.hasOwnProperty(k);

			if (returnVal) {
				target = target[k];
			}

			return returnVal;
		});
	}

	/**
	 * Puts a value into the map, overwriting any preexisting value.
	 *
	 * @public
	 * @param {*} value
	 * @param {...string} keys
	 */
	put(value, ...keys) {
		validateKeys(keys, this.#depth, true);

		let target = this.#map;
		let final = keys.length - 1;

		keys.forEach((k, i) => {
			if (i === final) {
				target[k] = value;
			} else {
				if (!target.hasOwnProperty(k)) {
					target[k] = { };
				}

				target = target[k];
			}
		});
	}

	/**
	 * Gets a value from the map, returning null if the value does not exist.
	 *
	 * @public
	 * @param {...string} keys
	 * @returns {*}
	 */
	get(...keys) {
		validateKeys(keys, this.#depth, true);

		return keys.reduce((target, k) => {
			let next;

			if (is.object(target) && target.hasOwnProperty(k)) {
				next = target[k];
			} else {
				next = null;
			}

			return next;
		}, this.#map);
	}

	/**
	 * Deletes a value (or a group of values) from the tree.
	 *
	 * @public
	 * @param {...string} keys
	 * @returns {boolean}
	 */
	remove(...keys) {
		validateKeys(keys, this.#depth, false);

		let returnVal = this.has(...keys);

		if (returnVal) {
			keys.reduce((target, k, i) => {
				let next;

				if (keys.length === (i + 1)) {
					delete target[k];
				} else {
					next = target[k];
				}

				return next;
			}, this.#map);
		}

		return returnVal;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[CompoundMap]';
	}
}

function validateKeys(keys, depth, exact) {
	assert.argumentIsValid(keys, 'keys', k => (exact && k.length === depth) || (!exact && !(k.length > depth)), 'incorrect number of keys');
}
