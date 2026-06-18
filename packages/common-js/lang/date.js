/**
 * Returns the current Unix timestamp in milliseconds.
 *
 * @public
 * @returns {number}
 */
export function getTimestamp() {
	return (new Date()).getTime();
}

/**
 * Returns the abbreviated weekday name for a date.
 *
 * @public
 * @param {Date} date
 * @returns {string}
 */
export function getShortDay(date) {
	const day = date.getDay();

	return days[day].short;
}

/**
 * Returns the day of the month for a date.
 *
 * @public
 * @param {Date} date
 * @returns {number}
 */
export function getDate(date) {
	return date.getDate();
}

/**
 * Returns the ordinal suffix for a date's day of the month.
 *
 * @public
 * @param {Date} date
 * @returns {string}
 */
export function getDateOrdinal(date) {
	const d = getDate(date);
	const remainder = d % 10;

	let returnRef;

	if (remainder === 1 && d !== 11) {
		returnRef = 'st';
	} else if (remainder === 2 && d !== 12) {
		returnRef = 'nd';
	} else if (remainder === 3 && d !== 13) {
		returnRef = 'rd';
	} else {
		returnRef = 'th';
	}

	return returnRef;
}

/**
 * Returns the abbreviated month name for a date.
 *
 * @public
 * @param {Date} date
 * @returns {string}
 */
export function getShortMonth(date) {
	const month = date.getMonth();

	return months[month].short;
}

/**
 * Returns the full year for a date.
 *
 * @public
 * @param {Date} date
 * @returns {number}
 */
export function getYear(date) {
	return date.getFullYear();
}

const days = [
	{ short: 'Sun' },
	{ short: 'Mon' },
	{ short: 'Tue' },
	{ short: 'Wed' },
	{ short: 'Thu' },
	{ short: 'Fri' },
	{ short: 'Sat' }
];

const months = [
	{ short: 'Jan' },
	{ short: 'Feb' },
	{ short: 'Mar' },
	{ short: 'Apr' },
	{ short: 'May' },
	{ short: 'Jun' },
	{ short: 'Jul' },
	{ short: 'Aug' },
	{ short: 'Sep' },
	{ short: 'Oct' },
	{ short: 'Nov' },
	{ short: 'Dec' }
];
