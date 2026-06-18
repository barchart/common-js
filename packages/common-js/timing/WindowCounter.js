import * as assert from './../lang/assert.js';

export default class WindowCounter {
	#duration;
	#windows;
	#maximum;
	#previousCount;

	/**
	 * @param {number} duration
	 * @param {number} windows
	 */
	constructor(duration, windows) {
		assert.argumentIsRequired(duration, 'duration', Number);
		assert.argumentIsRequired(windows, 'windows', Number);

		this.#duration = duration;

		this.#windows = [ new Window(getTime(), this.#duration) ];
		this.#maximum = Math.max(windows, 2);

		this.#previousCount = 0;
	}

	/**
	 * @public
	 * @param {number} count
	 */
	increment(count) {
		assert.argumentIsRequired(count, 'count', Number);

		this.#advance().increment(count);
	}

	/**
	 * @public
	 * @returns {number}
	 */
	getCurrent() {
		return this.#advance().getCount();
	}

	/**
	 * @public
	 * @returns {number}
	 */
	getPrevious() {
		this.#advance();

		let returnVal;

		if (this.#windows.length > 1) {
			returnVal = this.#windows[1].getCount();
		} else {
			returnVal = 0;
		}

		return returnVal;
	}

	/**
	 * @public
	 * @returns {number}
	 */
	getAverage() {
		const previousWindows = this.#windows.length - 1;

		let returnVal;

		if (previousWindows > 0) {
			returnVal = this.#previousCount / previousWindows;
		} else {
			returnVal = 0;
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
		return '[WindowCounter]';
	}

	#advance() {
		const now = getTime();

		while (!this.#windows[0].contains(now)) {
			const previous = this.#windows[0];
			const current = new Window(previous.getEnd(), this.#duration);

			this.#windows.unshift(current);

			this.#previousCount = this.#previousCount + previous.getCount();

			if (this.#windows.length > this.#maximum) {
				const removed = this.#windows.pop();

				this.#previousCount = this.#previousCount - removed.getCount();
			}
		}

		return this.#windows[0];
	}
}

function getTime() {
	return (new Date()).getTime();
}

class Window {
	#start;
	#end;
	#count;

	constructor(start, duration) {
		this.#start = start;
		this.#end = start + duration;

		this.#count = 0;
	}

	contains(now) {
		return !(now < this.#start || now > this.#end);
	}

	increment(count) {
		this.#count = this.#count + count;
	}

	getStart() {
		return this.#start;
	}

	getEnd() {
		return this.#end;
	}

	getCount() {
		return this.#count;
	}
}
