const assert = require('./../../lang/assert');

module.exports = (() => {
	'use strict';

	const empty = { };

	/**
	 * A list that is restricted to a certain capacity. If adding an
	 * item would exceed the capacity; the oldest item is removed.
	 *
	 * @public
	 */
	class EvictingList {
		constructor(capacity) {
			assert.argumentIsOptional(capacity, 'capacity', Number);

			this._capacity = Math.max((capacity || 0), 0) || 10;

			this._array = [ ];

			for (let i = 0; i < this._capacity; i++) {
				this._array[i] = empty;
			}

			this._head = null;
		}

		add(item) {
			this._array[this._head = getNextIndex(this._head, this._capacity)] = item;
		}

		peek() {
			if (this.empty()) {
				throw new Error('EvictingList is empty');
			}

			return this._array[this._head];
		}

		empty() {
			return this._head === null;
		}

		getCapacity() {
			return this._capacity;
		}

		toArray() {
			let returnRef = [ ];

			if (!this.empty()) {
				let current = this._head;

				for (let i = 0; i < this._capacity; i++) {
					const item = this._array[current];

					if (item === empty) {
						break;
					}

					returnRef.push(item);

					current = getPreviousIndex(current, this._capacity);
				}
			}

			return returnRef;
		}

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

	return EvictingList;
})();