const moment = require('moment-timezone/builds/moment-timezone-with-data-2010-2020'),
	assert = require('./assert');

module.exports = (() => {
	'use strict';

	const timezone = {
		getTimezones() {
			return moment.tz.names();
		},

		hasTimezone(name) {
			assert.argumentIsRequired(name, 'name', String);

			return timezone.getTimezones().some((candidate) => {
				return candidate === name;
			});
		},

		guessTimezone() {
			return moment.tz.guess() || null;
		}
	};

	return timezone;
})();