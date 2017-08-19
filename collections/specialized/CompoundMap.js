const assert = require('./../../lang/assert'),
	is = require('./../../lang/is');

module.exports = (() => {
	'use strict';

	/**
	 * A map that stores data using a compound key -- without the need
	 * to implement objects needing to implement equals and hashcode.
	 *
	 * @public
	 * @param {Number} depth - The number of keys.
	 */
	class CompoundMap {
		constructor(depth) {
			assert.argumentIsRequired(depth, 'depth', Number);

			this._depth = depth;

			this._map = { };
		}

		/**
		 * Returns true if the map has a value for the key.
		 *
		 * @public
		 * @param {...String} keys
		 * @returns {Boolean}
		 */
		has(...keys) {
			validateKeys(keys, this._depth);

			let target = this._map;

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
		 * @param {...String} keys
		 */
		put(value, ...keys) {
			validateKeys(keys, this._depth);

			let target = this._map;
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
		 * Gets a value into the map, returning null if the value does not
		 * exist.
		 *
		 * @public
		 * @param {...String} keys
		 * @reeturns {*}
		 */
		get(...keys) {
			validateKeys(keys, this._depth);

			return keys.reduce((target, k) => {
				let next;

				if (is.object(target) && target.hasOwnProperty(k)) {
					next = target[k];
				} else {
					next = null;
				}

				return next;
			}, this._map);
		}

		toString() {
			return '[CompoundMap]';
		}
	}

	function validateKeys(keys, depth) {
		assert.argumentIsValid(keys, 'keys', k => k.length === depth, 'incorrect number of keys');
	}

	return CompoundMap;
})();
