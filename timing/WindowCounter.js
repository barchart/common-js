const assert = require('./../lang/assert'),
	Queue = require('./../collections/Queue');

module.exports = (() => {
	'use strict';

	class WindowCounter {
		constructor(duration, windows) {
			assert.argumentIsRequired(duration, 'duration', Number);
			assert.argumentIsRequired(windows, 'windows', Number);

			this._duration = duration;

			this._windows = [ new Window(getTime(), this._duration) ];
			this._maximum = Math.max(windows, 2);

			this._previousCount = 0;
		}

		increment(count) {
			assert.argumentIsRequired(count, 'count', Number);

			advance.call(this).increment(count);
		}

		getCurrent() {
			return advance.call(this).getCount();
		}

		getPrevious() {
			advance.call(this);

			let returnVal;

			if (this._windows.length > 1) {
				returnVal = this._windows[1].getCount();
			} else {
				returnVal = 0;
			}

			return returnVal;
		}

		getAverage() {
			const current = advance.call(this);
			const previousWindows = this._windows.length - 1;

			let returnVal;

			if (previousWindows > 0) {
				returnVal = this._previousCount / previousWindows;
			} else {
				returnVal = 0;
			}

			return returnVal;
		}

		toString() {
			return '[WindowCounter]';
		}
	}

	function advance() {
		const now = getTime();

		while (!this._windows[0].contains(now)) {
			const previous = this._windows[0];
			const current = new Window(previous.getEnd(), this._duration);

			this._windows.unshift(current);

			this._previousCount = this._previousCount + previous.getCount();

			if (this._windows.length > this._maximum) {
				const removed = this._windows.pop();

				this._previousCount = this._previousCount - removed.getCount();
			}
		}

		return this._windows[0];
	}

	function getTime() {
		return (new Date()).getTime();
	}

	class Window {
		constructor(start, duration) {
			this._start = start;
			this._end = start + duration;

			this._count = 0;
		}

		contains(now) {
			return !(now < this._start || now > this._end);
		}

		increment(count) {
			this._count = this._count + count;
		}

		getStart() {
			return this._start;
		}

		getEnd() {
			return this._end;
		}

		getCount() {
			return this._count;
		}
	}

	return WindowCounter;
})();