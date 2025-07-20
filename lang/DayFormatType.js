const Enum = require('./Enum');

module.exports = (() => {
	'use strict';

	/**
	 * Describes for a day can be formatted.
	 *
	 * @public
	 * @extends {Enum}
	 * @param {String} description
	 */
	class DayFormatType extends Enum {
		constructor(description, regex, yearIndex, monthIndex, dayIndex) {
			super(description, description);

			this._regex = regex;

			this._yearIndex = yearIndex;
			this._monthIndex = monthIndex;
			this._dayIndex = dayIndex;
		}

		/**
		 * A regular expression for parsing the day type.
		 *
		 * @public
		 * @returns {RegExp}
		 */
		get regex() {
			return this._regex;
		}

		/**
		 * The index used to read the year from a regular expression match.
		 *
		 * @public
		 * @returns {number}
		 */
		get yearIndex() {
			return this._yearIndex;
		}

		/**
		 * The index used to read the month from a regular expression match.
		 *
		 * @public
		 * @returns {number}
		 */
		get monthIndex() {
			return this._monthIndex;
		}

		/**
		 * The index used to read the day from a regular expression match.
		 *
		 * @public
		 * @returns {number}
		 */
		get dayIndex() {
			return this._dayIndex;
		}

		/**
		 * Specifies date formatting as year, then month, then day (e.g. 2025-11-31).
		 *
		 * @public
		 * @static
		 * @returns {DayFormatType}
		 */
		static get YEAR_MONTH_DAY() {
			return yearMonthDay;
		}

		/**
		 * Specifies date formatting as month, then day, then year (e.g. 11-31-2025).
		 *
		 * @public
		 * @static
		 * @returns {DayFormatType}
		 */
		static get MONTH_DAY_YEAR() {
			return monthDayYear;
		}

		toString() {
			return `[DayFormatType (description=${this.description})]`;
		}
	}

	const yearMonthDay = new DayFormatType('YEAR_MONTH_DAY', /^([0-9]{4}).?([0-9]{2}).?([0-9]{2})$/, 1, 2, 3);
	const monthDayYear = new DayFormatType('MONTH_DAY_YEAR', /^([0-9]{2}).?([0-9]{2}).?([0-9]{4})$/, 3, 1, 2);

	return DayFormatType;
})();