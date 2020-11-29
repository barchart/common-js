const moment = require('moment-timezone/builds/moment-timezone-with-data-2012-2022');

const Enum = require('./Enum'),
	is = require('./is'),
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
		 * Attempts to determine if daylight savings time is in effect.
		 *
		 * @public
		 * @param {Number=} timestamp - The moment at which the daylight savings time is checked, otherwise now.
		 * @returns {Number}
		 */
		getIsDaylightSavingsTime(timestamp) {
			let m;

			if (is.number(timestamp)) {
				m = moment(timestamp);
			} else {
				m = moment();
			}

			return m.tz(this.code).isDST();
		}

		/**
		 * Calculates and returns the timezone's offset from UTC.
		 *
		 * @public
		 * @param {Number=} timestamp - The moment at which the offset is calculated, otherwise now.
		 * @param {Boolean=} milliseconds - If true, the offset is returned in milliseconds; otherwise minutes.
		 * @returns {Number}
		 */
		getUtcOffset(timestamp, milliseconds) {
			let timestampToUse;

			if (is.number(timestamp)) {
				timestampToUse = timestamp;
			} else {
				timestampToUse = (new Date()).getTime();
			}

			let multiplier;

			if (is.boolean(milliseconds) && milliseconds) {
				multiplier = 60 * 1000;
			} else {
				multiplier = 1;
			}

			const offset = moment.tz.zone(this.code).utcOffset(timestampToUse) * multiplier;

			if (offset !== 0) {
				return offset * -1;
			} else {
				return 0;
			}
		}

		/**
		 *
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
		 * UTC
		 *
		 * @public
		 * @static
		 * @returns {Timezones}
		 */
		static get UTC() {
			return utc;
		}

		/**
		 * America/Chicago
		 *
		 * @public
		 * @static
		 * @returns {Timezones}
		 */
		static get AMERICA_CHICAGO() {
			return america_chicago;
		}

		/**
		 * America/New_York
		 *
		 * @public
		 * @static
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

	const utc = Enum.fromCode(Timezones, 'UTC');
	const america_chicago = Enum.fromCode(Timezones, 'America/Chicago');
	const america_new_york = Enum.fromCode(Timezones, 'America/New_York');

	return Timezones;
})();
