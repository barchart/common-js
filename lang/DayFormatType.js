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
		constructor(description, regex, yearIndex, monthIndex, dayIndex, yearShift) {
			super(description, description);

			this._regex = regex;

			this._yearIndex = yearIndex;
			this._monthIndex = monthIndex;
			this._dayIndex = dayIndex;

			this._yearShift = yearShift;
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
		 * The amount to add to the year (extracted from a formatted string) to get the
		 * full year (e.g. for "11-31-25" of a MM-DD-YY string, the value will be 2000).
		 *
		 * @public
		 * @returns {number}
		 */
		get yearShift() {
			return this._yearShift;
		}

		/**
		 * Specifies date formatting as four-digit year, then month, then day (e.g. 2025-11-31).
		 *
		 * @public
		 * @static
		 * @returns {DayFormatType}
		 */
		static get YYYY_MM_DD() {
			return yyyymmdd;
		}

		/**
		 * Specifies date formatting as month, then day, then four-digit year (e.g. 11-31-2025).
		 *
		 * @public
		 * @static
		 * @returns {DayFormatType}
		 */
		static get MM_DD_YYYY() {
			return mmddyyyy;
		}

		/**
		 * Specifies date formatting as month, then day, then two-digit year (e.g. 11-31-25).
		 *
		 * @public
		 * @static
		 * @returns {DayFormatType}
		 */
		static get MM_DD_YY() {
			return mmddyy;
		}

		toString() {
			return `[DayFormatType (description=${this.description})]`;
		}
	}

	function getMillenniumShift() {
		const today = new Date();

		return Math.floor(today.getFullYear() / 100) * 100;
	}

    const yyyymmdd = new DayFormatType('YYYY_MM_DD', /^([0-9]{4})[-/.]?([0-9]{1,2})[-/.]?([0-9]{1,2})$/, 1, 2, 3, 0);

    const mmddyyyy = new DayFormatType('MM_DD_YYYY', /^([0-9]{1,2})[-/.]?([0-9]{1,2})[-/.]?([0-9]{4})$/, 3, 1, 2, 0);
    const mmddyy = new DayFormatType('MM_DD_YY', /^([0-9]{1,2})[-/.]?([0-9]{1,2})[-/.]?([0-9]{2})$/, 3, 1, 2, getMillenniumShift());

	return DayFormatType;
})();