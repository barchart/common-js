module.exports = (() => {
	'use strict';

	class Queue {
		constructor() {
			this._array = [];
		}

		enqueue(item) {
			this._array.push(item);

			return item;
		}

		dequeue() {
			if (this.empty()) {
				throw new Error('Queue is empty');
			}

			return this._array.shift();
		}

		peek() {
			if (this.empty()) {
				throw new Error('Queue is empty');
			}

			return this._array[0];
		}

		empty() {
			return this._array.length === 0;
		}

		isEmpty() {
			return this.empty();
		}

		toString() {
			return '[Queue]';
		}
	}

	return Queue;
})();
