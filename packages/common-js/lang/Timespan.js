const assert = require('./assert'),
	is = require('./is');

module.exports = (() => {
	'use strict';

	const MILLISECONDS_PER_SECOND = 1000;
	const SECONDS_PER_MINUTE = 60;
	const MINUTES_PER_HOUR = 60;
	const HOURS_PER_DAY = 24;

	const MAX_HOURS = 23;
	const MAX_MINUTES = 59;
	const MAX_SECONDS = 59;

	/**
	 * A data structure that represents the time between two dates.
	 *
	 * @public
	 * @param {Number} start
	 * @param {Number} end
	 */
	class Timespan {
		constructor(start, end) {
			assert.argumentIsValid(start, 'start', is.large, 'is an integer');
			assert.argumentIsValid(end, 'end', is.large, 'is an integer');

			if (start > end) {
				throw new Error('The "start" parameter cannot be after the "end" parameter');
			}

			this._start = start;
			this._end = end;
		}

		/**
		 * The start time (as milliseconds since epoch).
		 *
		 * @public
		 * @returns {Number}
		 */
		get start() {
			return this._start;
		}

		/**
		 * The start time (as milliseconds since epoch).
		 *
		 * @public
		 * @returns {Number}
		 */
		get end() {
			return this._end;
		}

		/**
		 * The total number of days between the start and end times (rounded down to the nearest integer).
		 *
		 * @public
		 * @returns {number}
		 */
		get days() {
			return Math.floor(this.milliseconds / (MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY));
		}

		/**
		 * The total number of hours between the start and end times (rounded down to the nearest integer).
		 *
		 * @public
		 * @returns {number}
		 */
		get hours() {
			return Math.floor(this.milliseconds / (MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR));
		}

		/**
		 * The total number of minutes between the start and end times (rounded down to the nearest integer).
		 *
		 * @public
		 * @returns {number}
		 */
		get minutes() {
			return Math.floor(this.milliseconds / (MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE));
		}

		/**
		 * The total number of seconds between the start and end times (rounded down to the nearest integer).
		 *
		 * @public
		 * @returns {number}
		 */
		get seconds() {
			return Math.floor(this.milliseconds / MILLISECONDS_PER_SECOND);
		}

		/**
		 * The total number of milliseconds between the start and end times.
		 *
		 * @public
		 * @returns {number}
		 */
		get milliseconds() {
			return this._end - this._start;
		}

		/**
		 * Returns the duration between the start and end times as days, hours, minutes, seconds, and
		 * milliseconds.
		 *
		 * @public
		 * @param {Boolean} days
		 * @param {Boolean} hours
		 * @param {Boolean} minutes
		 * @param {Boolean} seconds
		 * @returns {{days: number, hours: number, minutes: *, seconds: number, milliseconds: number}}
		 */
		getDuration(days, hours, minutes, seconds) {
			assert.argumentIsOptional(days, 'days', Boolean);
			assert.argumentIsOptional(hours, 'hours', Boolean);
			assert.argumentIsOptional(seconds, 'minutes', Boolean);
			assert.argumentIsOptional(seconds, 'seconds', Boolean);

			let milliseconds = this.milliseconds;

			let d = 0, h = 0, m = 0, s = 0;

			if (days) {
				const factor = MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY;

				d = Math.floor(milliseconds / factor);

				milliseconds = milliseconds - (d * factor);
			}

			if (hours) {
				const factor = MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR;

				h = Math.floor(milliseconds / factor);

				if (days && h > MAX_HOURS) {
					h = 23;
				}

				milliseconds = milliseconds - (h * factor);
			}

			if (minutes) {
				const factor = MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE;

				m = Math.floor(milliseconds / factor);

				if (hours && m > MAX_MINUTES) {
					m = MAX_MINUTES;
				}

				milliseconds = milliseconds - (m * factor);
			}

			if (seconds) {
				const factor = MILLISECONDS_PER_SECOND;

				s = Math.floor(milliseconds / factor);

				if (minutes && s > MAX_SECONDS) {
					s = MAX_SECONDS;
				}

				milliseconds = milliseconds - (s * factor);
			}

			return { days: d, hours: h, minutes: m, seconds: s, milliseconds };
		}

		/**
		 * Creates a new {@link Timespan} instance from dates.
		 *
		 * @public
		 * @static
		 * @param {Date} start
		 * @param {Date} end
		 * @returns {Timespan}
		 */
		static fromDates(start, end) {
			assert.argumentIsRequired(start, 'start', Date, 'Date');
			assert.argumentIsRequired(end, 'end', Date, 'Date');

			return new Timespan(start.getTime(), end.getTime());
		}

		/**
		 * Returns the JSON representation.
		 *
		 * @public
		 * @returns {Object}
		 */
		toJSON() {
			const start = this._start;
			const end = this._end;

			return { start, end };
		}

		toString() {
			return '[Timespan]';
		}
	}

	return Timespan;
})();
