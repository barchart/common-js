var moment = require('moment-timezone/builds/moment-timezone-with-data-2010-2020');
var assert = require('./assert');

module.exports = (() => {
	'use strict';

	return {
		getTimezones() {
			return moment.tz.names();
		},

		hasTimezone(timezone) {
			assert.argumentIsRequired(timezone, 'timezone', String);

			return timezone.getTimezones().some((candidate) => {
				return candidate === timezone;
			});
		},

		guessTimezone() {
			return moment.tz.guess() || null;
		}
	};
})();