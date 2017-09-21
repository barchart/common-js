const assert = require('./assert'),
	Enum = require('./Enum'),
	timezone = require('./timezone');

module.exports = (() => {
	'use strict';

	/**
	 * An enumeration item that lists timezones, according to the common names
	 * used in the tz database (see https://en.wikipedia.org/wiki/Tz_database).
	 * The full list of names is sourced from moment.js; however, this wikipedia
	 * article lists them: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
	 *
	 * @public
	 * @param {String} code - The timezone name
	 * @extends {Enum}
	 */
	class Timezones extends Enum {
		constructor(code) {
			super(code, code);
		}

		/**
		 * Given a code, returns the enumeration item.
		 *
		 * @public
		 * @param {String} code
		 * @returns {Timezones|null}
		 */
		static parse(code) {
			return Enum.fromCode(Timezones, code);
		}

		/**
		 * America/Chicago
		 *
		 * @public
		 * @returns {Timezones}
		 */
		static get AMERICA_CHICAGO() {
			return america_chicago;
		}

		/**
		 * America/New_York
		 *
		 * @public
		 * @returns {Timezones}
		 */
		static get AMERICA_NEW_YORK() {
			return america_new_york;
		}

		toString() {
			return `[Timezone (name=${this.code})]`;
		}
	}

	timezone.getTimezones().forEach(name => new Timezones(name));

	const america_chicago = Enum.fromCode(Timezones, 'America/Chicago');
	const america_new_york = Enum.fromCode(Timezones, 'America/New_York');

	return Timezones;
})();
