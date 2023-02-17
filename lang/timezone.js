const moment = require('moment-timezone/builds/moment-timezone-with-data-2012-2022'),
	assert = require('./assert');

module.exports = (() => {
	'use strict';

	/**
	 * Utilities for working with timezones.
	 *
	 * @public
	 * @module lang/timezone
	 */
	return {
		/**
		 * Gets a list of names in the tz database (see https://en.wikipedia.org/wiki/Tz_database
		 * and https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).
		 *
		 * @public
		 * @static
		 * @returns {Array<String>}
		 */
		getTimezones() {
			return moment.tz.names();
		},

		/**
		 * Indicates if a timezone name exists.
		 *
		 * @public
		 * @static
		 * @param {String} name - The timezone name to find.
		 * @returns {Boolean}
		 */
		hasTimezone(name) {
			assert.argumentIsRequired(name, 'name', String);

			return this.getTimezones().some((candidate) => {
				return candidate === name;
			});
		},

		/**
		 * Attempts to guess the timezone of the current computer.
		 *
		 * @public
		 * @static
		 * @returns {String|null}
		 */
		guessTimezone() {
			return moment.tz.guess() || null;
		}
	};
})();