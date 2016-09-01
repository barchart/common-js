module.exports = (() => {
	'use strict';

	class Stack {
		constructor() {
			this._array = [];
		}

		push(item) {
			this._array.unshift(item);

			return item;
		}

		pop() {
			if (this.empty()) {
				throw new Error('Stack is empty');
			}

			return this._array.shift();
		}

		peek() {
			if (this.empty()) {
				throw new Error('Stack is empty');
			}

			return this._array[0];
		}

		empty() {
			return this._array.length === 0;
		}

		toString() {
			return '[Stack]';
		}
	}

	return Stack;
})();