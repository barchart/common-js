const assert = require('./assert'),
	is = require('./is');

module.exports = (() => {
	'use strict';

	/**
	 * A data structure that represents a day (year, month, and day)
	 * without consideration for time or timezone.
	 *
	 * @public
	 */
	class Day {
		constructor(year, month, day) {
			if (!Day.validate(year, month, day)) {
				throw new Error(`Unable to instantiate Day, input is invalid [${year}], [${month}], [${day}]`);
			}

			this._year = year;
			this._month = month;
			this._day = day;
		}

		/**
		 * The year.
		 *
		 * @returns {Number}
		 */
		get year() {
			return this._year;
		}

		/**
		 * The month of the year (January is one, December is twelve).
		 *
		 * @returns {*}
		 */
		get month() {
			return this._month;
		}

		/**
		 * The day of the month.
		 *
		 * @returns {Number}
		 */
		get day() {
			return this._day;
		}

		/**
		 * Outputs the date as the formatted string: {year}-{month}-{day}.
		 *
		 * @returns {String}
		 */
		format() {
			return `${this._year}-${leftPad(this._month)}-${leftPad(this._day)}`;
		}

		static parse(value) {
			assert.argumentIsRequired(value, 'value', String);

			const match = value.match(dayRegex);

			if (match === null) {
				throw new Error(`Unable to parse value as Day [ ${value} ]`);
			}

			return new Day(parseInt(match[1]), parseInt(match[2]), parseInt(match[3]));
		}

		static validate(year, month, day) {
			return is.integer(year) &&
				is.integer(month) &&
				is.integer(day) &&
				!(month  < 1) &&
				!(month > 12) &&
				!(day  < 1) &&
				!(day > 29 && month === 2) &&
				!(day > 30 && (month === 4 || month === 6 || month === 9 || month === 11)) &&
				!(day > 31);
		}

		toString() {
			return '[Day]';
		}
	}

	const dayRegex = /^([0-9]{4}).([0-9]{2}).([0-9]{2})$/;

	function leftPad(value) {
		return value < 10 ? `0${value}` : `${value}`;
	}

	return Day;
})();
