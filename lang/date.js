module.exports = (() => {
	'use strict';

	const utilities = {
		getShortDay(date) {
			const day = date.getDay();

			return days[day].short;
		},

		getDate(date) {
			return date.getDate();
		},

		getDateOrdinal(date) {
			const d = utilities.getDate(date);
			const remainder = d % 10;

			let returnRef;

			if (remainder === 1 && d !== 11) {
				returnRef = 'st';
			} else if (remainder === 2 && d !== 12) {
				returnRef = 'nd';
			} else if (remainder === 3) {
				returnRef = 'rd';
			} else {
				returnRef = 'th';
			}

			return returnRef;
		},

		getShortMonth(date) {
			const month = date.getMonth();

			return months[month].short;
		},

		getYear(date) {
			return date.getFullYear();
		}
	};

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

	return utilities;
})();