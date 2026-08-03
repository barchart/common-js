import Enum from './Enum.js';

/**
 * Describes for a day can be formatted.
 *
 * @public
 * @extends {Enum}
 */
export default class DayFormatType extends Enum {
	#regex;

	#yearIndex;
	#monthIndex;
	#dayIndex;

	#yearShift;

	/**
     * @param {string} description
     * @param {RegExp} regex
     * @param {number} yearIndex
     * @param {number} monthIndex
     * @param {number} dayIndex
     * @param {number} yearShift
     */
	constructor(description, regex, yearIndex, monthIndex, dayIndex, yearShift) {
		super(description, description);

		this.#regex = regex;

		this.#yearIndex = yearIndex;
		this.#monthIndex = monthIndex;
		this.#dayIndex = dayIndex;

		this.#yearShift = yearShift;
	}

	/**
	 * A regular expression for parsing the day type.
	 *
	 * @public
	 * @returns {RegExp}
	 */
	get regex() {
		return this.#regex;
	}

	/**
	 * The index used to read the year from a regular expression match.
	 *
	 * @public
	 * @returns {number}
	 */
	get yearIndex() {
		return this.#yearIndex;
	}

	/**
	 * The index used to read the month from a regular expression match.
	 *
	 * @public
	 * @returns {number}
	 */
	get monthIndex() {
		return this.#monthIndex;
	}

	/**
	 * The index used to read the day from a regular expression match.
	 *
	 * @public
	 * @returns {number}
	 */
	get dayIndex() {
		return this.#dayIndex;
	}

	/**
	 * The amount to add to the year (extracted from a formatted string) to get the
	 * full year (e.g. for "11-31-25" of an MM-DD-YY string, the value will be 2000).
	 *
	 * @public
	 * @returns {number}
	 */
	get yearShift() {
		return this.#yearShift;
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

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
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
