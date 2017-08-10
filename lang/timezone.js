const moment = require('moment-timezone/builds/moment-timezone-with-data-2010-2020'),
	assert = require('./assert');

module.exports = (() => {
	'use strict';

	/**
	 * Utilities for working with arrays.
	 *
	 * @public
	 * @module lang/array
	 */
	return {
		/**
		 * Gets a list of names in the tz database (see https://en.wikipedia.org/wiki/Tz_database
		 * and https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
		 *
		 * @static
		 * @returns {Array<String>}
		 */
		getTimezones() {
			return moment.tz.names();
		},

		/**
		 * Indicates if a timezone name exists.
		 *
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
		 * Attempts to guess the current timezone.
		 *
		 * @returns {String|null}
		 */
		guessTimezone() {
			return moment.tz.guess() || null;
		}
	};
})();