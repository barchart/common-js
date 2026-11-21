import * as assert from './../lang/assert.js';
import * as date from './../lang/date.js';

/**
 * Counts occurrences within a specific duration (i.e. a window) and stores a configurable
 * number of windows.
 *
 * @public
 */
export default class WindowCounter {
	#windows;

	#duration;
	#maximum;

	#previousCount;

	/**
	 * @param {number} duration - The window length, in milliseconds.
	 * @param {number} windows - The maximum number of windows to track, including the current window.
	 */
	constructor(duration, windows) {
		assert.argumentIsRequired(duration, 'duration', Number);
		assert.argumentIsRequired(windows, 'windows', Number);
		assert.argumentIsValid(duration, 'duration', d => d !== 0, 'must not be zero');

		this.#duration = Math.ceil(Math.abs(duration));

		this.#windows = [ new Window(date.getTimestamp(), this.#duration) ];
		this.#maximum = Math.max(Math.ceil(windows), 2);

		this.#previousCount = 0;
	}

	/**
	 * Increments the counter for the current window.
	 *
	 * @public
	 * @param {number} count
	 */
	increment(count) {
		assert.argumentIsRequired(count, 'count', Number);

		this.#advance().increment(count);
	}

	/**
	 * Gets the count for the current window.
	 *
	 * @public
	 * @returns {number}
	 */
	getCurrent() {
		return this.#advance().count;
	}

	/**
	 * Gets the count from the previous window.
	 *
	 * @public
	 * @returns {number}
	 */
	getPrevious() {
		this.#advance();

		if (this.#windows.length > 1) {
			return this.#windows[1].count;
		}

		return 0;
	}

	/**
	 * Gets the average (window) count excluding the current window.
	 *
	 * @public
	 * @returns {number}
	 */
	getAverage() {
		this.#advance();

		const previousWindows = this.#windows.length - 1;

		if (previousWindows > 0) {
			return this.#previousCount / previousWindows;
		}

		return 0;
	}

	/**
	 * Returns the current window, adding new window(s) as necessary and removing
	 * windows that exceed the instance's capacity.
	 *
	 * @private
	 * @returns {Window}
	 */
	#advance() {
		const now = date.getTimestamp();

		let current = this.#windows[0];

		if (current.contains(now)) {
			return current;
		}

		const gap = now - current.end;
		const missing = Math.ceil(gap / this.#duration);

		if (missing > this.#maximum) {
			current = new Window((current.end + (missing - 1) * this.#duration), this.#duration);

			this.#windows = [ current ];

			this.#previousCount = 0;

			return current;
		}

		while (true) {
			const previous = current;

			current = new Window(previous.end, this.#duration);

			this.#windows.unshift(current);

			this.#previousCount = this.#previousCount + previous.count;

			if (this.#windows.length > this.#maximum) {
				const removed = this.#windows.pop();

				this.#previousCount = this.#previousCount - removed.count;
			}

			if (current.contains(now)) {
				break;
			}
		}

		return current;
	}

	/**
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[WindowCounter]';
	}
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

	get start() {
		return this.#start;
	}

	get end() {
		return this.#end;
	}

	get count() {
		return this.#count;
	}

	toString() {
		return `[Window (start=${this.#start}, end=${this.#end})]`;
	}
}
