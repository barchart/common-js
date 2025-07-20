const assert = require('./assert'),
	ComparatorBuilder = require('./../collections/sorting/ComparatorBuilder'),
	comparators = require('./../collections/sorting/comparators'),
	DayFormatType = require('.//DayFormatType'),
	is = require('./is');

module.exports = (() => {
	'use strict';

	/**
	 * A data structure that represents a day (year, month, and day)
	 * without consideration for time or timezone.
	 *
	 * @public
	 * @param {Number} year
	 * @param {Number} month
	 * @param {Number} day
	 */
	class Day {
		constructor(year, month, day) {
			if (!Day.validate(year, month, day)) {
				throw new Error(`Unable to instantiate [ Day ], input is invalid [ ${year} ], [ ${month} ], [ ${day} ]`);
			}

			this._year = year;
			this._month = month;
			this._day = day;
		}

		/**
		 * Calculates a new {@link Day} in the future (or past).
		 *
		 * @public
		 * @param {Number} days - The number of days to add (negative numbers can be used for subtraction).
		 * @param {Boolean=} inverse - If true, the sign of the "days" value will be flipped.
		 * @returns {Day}
		 */
		addDays(days, inverse) {
			assert.argumentIsRequired(days, 'days', Number);
			assert.argumentIsOptional(inverse, inverse, Boolean);
			assert.argumentIsValid(days, 'days', is.large, 'is an integer');

			let totalDaysToShift;

			if (is.boolean(inverse) && inverse) {
				totalDaysToShift = days * -1;
			} else {
				totalDaysToShift = days;
			}

			const positive = is.positive(totalDaysToShift);

			let shiftedDay = this._day;
			let shiftedMonth = this._month;
			let shiftedYear = this._year;

			while (totalDaysToShift !== 0) {
				let monthDaysAvailable;
				let monthDaysToShift;

				if (positive) {
					monthDaysAvailable = Day.getDaysInMonth(shiftedYear, shiftedMonth) - shiftedDay;
					monthDaysToShift = Math.min(totalDaysToShift, monthDaysAvailable);
				} else {
					monthDaysAvailable = 1 - shiftedDay;
					monthDaysToShift = Math.max(totalDaysToShift, monthDaysAvailable);
				}

				totalDaysToShift = totalDaysToShift - monthDaysToShift;

				if (totalDaysToShift === 0) {
					shiftedDay = shiftedDay + monthDaysToShift;
				} else if (positive) {
					shiftedMonth++;

					if (shiftedMonth > 12) {
						shiftedYear++;
						shiftedMonth = 1;
					}

					shiftedDay = 0;
				} else {
					shiftedMonth--;

					if (shiftedMonth < 1) {
						shiftedYear--;
						shiftedMonth = 12;
					}

					shiftedDay = Day.getDaysInMonth(shiftedYear, shiftedMonth) + 1;
				}
			}

			return new Day(shiftedYear, shiftedMonth, shiftedDay);
		}

		/**
		 * Calculates a new {@link Day} in the past (or future).
		 *
		 * @public
		 * @param {Number} days - The number of days to subtract (negative numbers can be used for addition).
		 * @returns {Day}
		 */
		subtractDays(days) {
			return this.addDays(days, true);
		}

		/**
		 * Calculates a new {@link Day} in the future (or past). If the new date is at the end of
		 * the month and the new month has fewer days than the current month, days will be subtracted
		 * as necessary (e.g. adding one month to March 31 will return April 30).
		 *
		 * @public
		 * @param {Number} months - The number of months to add (negative numbers can be used for subtraction).
		 * @param {Boolean=} inverse - If true, the sign of the "days" value will be flipped.
		 * @returns {Day}
		 */
		addMonths(months, inverse) {
			assert.argumentIsRequired(months, 'months', Number);
			assert.argumentIsOptional(inverse, inverse, Boolean);
			assert.argumentIsValid(months, 'months', is.large, 'is an integer');

			let totalMonthsToShift;

			if (is.boolean(inverse) && inverse) {
				totalMonthsToShift = months * -1;
			} else {
				totalMonthsToShift = months;
			}

			const monthsToShift = totalMonthsToShift % 12;
			const yearsToShift = (totalMonthsToShift - monthsToShift) / 12;

			let shiftedYear = this.year + yearsToShift;
			let shiftedMonth = this.month + monthsToShift;
			let shiftedDay = this.day;

			if (shiftedMonth > 12) {
				shiftedYear = shiftedYear + 1;
				shiftedMonth = shiftedMonth - 12;
			}

			if (shiftedMonth < 1) {
				shiftedYear = shiftedYear - 1;
				shiftedMonth = shiftedMonth + 12;
			}

			while (!Day.validate(shiftedYear, shiftedMonth, shiftedDay)) {
				shiftedDay = shiftedDay - 1;
			}

			return new Day(shiftedYear, shiftedMonth, shiftedDay);
		}

		/**
		 * Calculates a new {@link Day} in the past (or future).
		 *
		 * @public
		 * @param {Number} months - The number of months to subtract (negative numbers can be used for addition).
		 * @returns {Day}
		 */
		subtractMonths(months) {
			return this.addMonths(months, true);
		}

		/**
		 * Calculates a new {@link Day} in the future (or past). If the new date is at the end of
		 * the month and the new month has fewer days than the current month, days will be subtracted
		 * as necessary (e.g. adding one year to February 29 will return February 28).
		 *
		 * @public
		 * @param {Number} years - The number of years to add (negative numbers can be used for subtraction).
		 * @param {Boolean=} inverse - If true, the sign of the "days" value will be flipped.
		 * @returns {Day}
		 */
		addYears(years, inverse) {
			assert.argumentIsRequired(years, 'years', Number);
			assert.argumentIsOptional(inverse, inverse, Boolean);
			assert.argumentIsValid(years, 'years', is.large, 'is an integer');

			let yearsToShift;

			if (is.boolean(inverse) && inverse) {
				yearsToShift = years * -1;
			} else {
				yearsToShift = years;
			}

			let shiftedYear = this.year + yearsToShift;
			let shiftedMonth = this.month;
			let shiftedDay = this.day;

			while (!Day.validate(shiftedYear, shiftedMonth, shiftedDay)) {
				shiftedDay = shiftedDay - 1;
			}

			return new Day(shiftedYear, shiftedMonth, shiftedDay);
		}

		/**
		 * Calculates a new {@link Day} in the past (or future).
		 *
		 * @public
		 * @param {Number} years - The number of years to subtract (negative numbers can be used for addition).
		 * @returns {Day}
		 */
		subtractYears(years) {
			return this.addYears(years, true);
		}

		/**
		 * Returns a new {@link Day} instance for the start of the month referenced by the current instance.
		 *
		 * @public
		 * @returns {Day}
		 */
		getStartOfMonth() {
			return new Day(this.year, this.month, 1);
		}

		/**
		 * Returns a new instance for the {@link Day} end of the month referenced by the current instance.
		 *
		 * @public
		 * @returns {Day}
		 */
		getEndOfMonth() {
			return new Day(this.year, this.month, Day.getDaysInMonth(this.year, this.month));
		}

		/**
		 * Indicates if the current {@link Day} instance occurs before another day.
		 *
		 * @public
		 * @param {Day} other
		 * @returns {boolean}
		 */
		getIsBefore(other) {
			return Day.compareDays(this, other) < 0;
		}

		/**
		 * Indicates if the current {@link Day} instance occurs after another day.
		 *
		 * @public
		 * @param {Day} other
		 * @returns {boolean}
		 */
		getIsAfter(other) {
			return Day.compareDays(this, other) > 0;
		}

		/**
		 * Indicates the current day falls between two other days, inclusive
		 * of the range boundaries.
		 *
		 * @public
		 * @param {Day=} first
		 * @param {Day=} last
		 * @returns {boolean}
		 */
		getIsContained(first, last) {
			assert.argumentIsOptional(first, 'first', Day, 'Day');
			assert.argumentIsOptional(last, 'last', Day, 'Day');

			let notAfter;
			let notBefore;

			if (first && last && first.getIsAfter(last)) {
				notBefore = false;
				notAfter = false;
			} else {
				notAfter = !(last instanceof Day) || !this.getIsAfter(last);
				notBefore = !(first instanceof Day) || !this.getIsBefore(first);
			}

			return notAfter && notBefore;
		}

		/**
		 * Indicates if another {@link Day} refers to the same moment.
		 *
		 * @public
		 * @param {Day} other
		 * @returns {boolean}
		 */
		getIsEqual(other) {
			return Day.compareDays(this, other) === 0;
		}

		/**
		 * Calculates and returns name of the day of the week (e.g. Monday, Tuesday, Wednesday, etc).
		 *
		 * @public
		 * @returns {String}
		 */
		getName() {
			const count = Day.countDaysBetween(REFERENCE_MONDAY, this);

			let index = count % NAMES_OF_DAYS.length;

			if (index < 0) {
				index = index + NAMES_OF_DAYS.length;
			}

			return NAMES_OF_DAYS[index];
		}

		/**
		 * The year.
		 *
		 * @public
		 * @returns {Number}
		 */
		get year() {
			return this._year;
		}

		/**
		 * The month of the year (January is one, December is twelve).
		 *
		 * @public
		 * @returns {Number}
		 */
		get month() {
			return this._month;
		}

		/**
		 * The day of the month.
		 *
		 * @public
		 * @returns {Number}
		 */
		get day() {
			return this._day;
		}

		/**
		 * Outputs the date as the formatted string: {year}-{month}-{day}.
		 *
		 * @public
		 * @returns {String}
		 */
		format() {
			return `${leftPad(this._year, 4, '0')}-${leftPad(this._month, 2, '0')}-${leftPad(this._day, 2, '0')}`;
		}

		/**
		 * Returns the JSON representation.
		 *
		 * @public
		 * @returns {String}
		 */
		toJSON() {
			return this.format();
		}

		/**
		 * Clones a {@link Day} instance.
		 *
		 * @public
		 * @static
		 * @param {Day} value
		 * @returns {Day}
		 */
		static clone(value) {
			assert.argumentIsRequired(value, 'value', Day, 'Day');

			return new Day(value.year, value.month, value.day);
		}

		/**
		 * Converts a string (which matches the output of {@link Day#format}) into
		 * a {@link Day} instance.
		 *
		 * @public
		 * @static
		 * @param {String} value
		 * @param {DayFormatType=} type
		 * @returns {Day}
		 */
		static parse(value, type) {
			assert.argumentIsRequired(value, 'value', String);

			let t;

			if (type instanceof DayFormatType) {
				t = type;
			} else {
				t = DayFormatType.YEAR_MONTH_DAY;
			}

			const match = value.match(t.regex);

			if (match === null) {
				throw new Error(`Unable to parse value as Day [ ${value} ]`);
			}

			return new Day(parseInt(match[t.yearIndex]), parseInt(match[t.monthIndex]), parseInt(match[t.dayIndex]));
		}

		/**
		 * Creates a {@link Day} from the year, month, and day properties (in local time)
		 * of the {@link Date} argument.
		 *
		 * @public
		 * @static
		 * @param {Date} date
		 * @returns {Day}
		 */
		static fromDate(date) {
			assert.argumentIsRequired(date, 'date', Date);

			return new Day(date.getFullYear(), date.getMonth() + 1, date.getDate());
		}

		/**
		 * Creates a {@link Day} from the year, month, and day properties (in UTC)
		 * of the {@link Date} argument.
		 *
		 * @public
		 * @static
		 * @param {Date} date
		 * @returns {Day}
		 */
		static fromDateUtc(date) {
			assert.argumentIsRequired(date, 'date', Date);

			return new Day(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
		}

		/**
		 * Returns a {@link Day} instance using today's local date.
		 *
		 * @public
		 * @static
		 * @returns {Day}
		 */
		static getToday() {
			return Day.fromDate(new Date());
		}

		/**
		 * Returns true if the year, month, and day combination is valid; otherwise false.
		 *
		 * @public
		 * @static
		 * @param {Number} year
		 * @param {Number} month
		 * @param {Number} day
		 * @returns {Boolean}
		 */
		static validate(year, month, day) {
			return is.integer(year) &&
				is.integer(month) &&
				is.integer(day) &&
				!(month  < 1) &&
				!(month > 12) &&
				!(day  < 1) &&
				!(day > Day.getDaysInMonth(year, month));
		}

		/**
		 * Returns the number of days in a given month.
		 *
		 * @public
		 * @static
		 * @param {number} year - The year number (e.g. 2017)
		 * @param {number} month - The month number (e.g. 2 is February)
		 * @returns {number}
		 */
		static getDaysInMonth(year, month) {
			switch (month) {
				case 1:
				case 3:
				case 5:
				case 7:
				case 8:
				case 10:
				case 12: {
					return 31;
				}
				case 4:
				case 6:
				case 9:
				case 11: {
					return 30;
				}
				case 2: {
					if (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)) {
						return 29;
					} else {
						return 28;
					}
				}
			}
		}

		/**
		 * A comparator function for {@link Day} instances.
		 *
		 * @public
		 * @static
		 * @param {Day} a
		 * @param {Day} b
		 * @returns {Number}
		 */
		static compareDays(a, b) {
			assert.argumentIsRequired(a, 'a', Day, 'Day');
			assert.argumentIsRequired(b, 'b', Day, 'Day');

			return comparator(a, b);
		}

		/**
		 * Calculates the number of days between two {@link Day} instances (may return
		 * a negative value).
		 *
		 * @public
		 * @static
		 * @param {Day} a
		 * @param {Day} b
		 * @returns {Number}
		 */
		static countDaysBetween(a, b) {
			assert.argumentIsRequired(a, 'a', Day, 'Day');
			assert.argumentIsRequired(b, 'b', Day, 'Day');

			if (a.getIsEqual(b)) {
				return 0;
			}

			let start;
			let end;

			let reversed = b.getIsBefore(a);

			if (reversed) {
				start = b;
				end = a;
			} else {
				start = a;
				end = b;
			}

			let currentMonth = start.month;
			let currentYear = start.year;

			let counter = 0 - start.day;

			while (!(currentMonth === end.month && currentYear === end.year)) {
				counter = counter + Day.getDaysInMonth(currentYear, currentMonth);

				if (currentMonth === 12) {
					currentMonth = 1;
					currentYear = currentYear + 1;
				} else {
					currentMonth = currentMonth + 1;
				}
			}

			counter = counter + end.day;

			if (reversed) {
				counter = counter * -1;
			}

			return counter;
		}

		toString() {
			return '[Day]';
		}
	}

	const dayRegex = /^([0-9]{4}).?([0-9]{2}).?([0-9]{2})$/;

	function leftPad(value, digits, character) {
		let string = value.toString();
		let padding = digits - string.length;

		return `${character.repeat(padding)}${string}`;
	}

	const comparator = ComparatorBuilder.startWith((a, b) => comparators.compareNumbers(a.year, b.year))
		.thenBy((a, b) => comparators.compareNumbers(a.month, b.month))
		.thenBy((a, b) => comparators.compareNumbers(a.day, b.day))
		.toComparator();

	const NAMES_OF_DAYS = [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday' ];
	const REFERENCE_MONDAY = new Day(2024, 1, 1);

	return Day;
})();
