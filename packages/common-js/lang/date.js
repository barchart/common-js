export function getTimestamp() {
	return (new Date()).getTime();
}

export function getShortDay(date) {
	const day = date.getDay();

	return days[day].short;
}

export function getDate(date) {
	return date.getDate();
}

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

export function getShortMonth(date) {
	const month = date.getMonth();

	return months[month].short;
}

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
