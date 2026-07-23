import * as assert from './assert.js';
import * as is from './is.js';
import * as timezone from './timezone.js';

import Enum from './Enum.js';

import { tzOffset } from '@date-fns/tz';

/**
 * An enumeration item that lists timezones, according to the common names
 * used in the tz database (see https://en.wikipedia.org/wiki/Tz_database).
 * The full list of names is sourced from moment.js; however, this wikipedia
 * article lists them: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
 *
 * @public
 * @extends {Enum}
 */
export default class Timezones extends Enum {
	/**
	 * @param {string} code - The timezone name.
	 */
	constructor(code) {
		super(code, code);
	}

	/**
	 * Attempts to determine whether daylight saving time is in effect.
	 *
	 * @public
	 * @param {number=} timestamp - The moment at which daylight saving time is checked; otherwise, the current time is used.
	 * @returns {boolean}
	 */
	getIsDaylightSavingsTime(timestamp) {
		assert.argumentIsOptional(timestamp, 'timestamp', Number);

		const now = new Date();

		let baseline = Date.UTC(now.getFullYear(), 0, 1);
		let candidate;

		if (timestamp) {
			candidate = timestamp;
		} else {
			candidate = now.getTime();
		}

		const baselineOffset = this.getUtcOffset(baseline);
		const candidateOffset = this.getUtcOffset(candidate);

		return baselineOffset !== candidateOffset;
	}

	/**
	 * Calculates and returns the offset of a timezone from UTC.
	 *
	 * @public
	 * @param {number=} timestamp - The moment at which the offset is calculated; otherwise, the current time is used.
	 * @param {boolean=} milliseconds - Whether the offset should be returned in milliseconds instead of minutes.
	 * @returns {number}
	 */
	getUtcOffset(timestamp, milliseconds) {
		assert.argumentIsOptional(timestamp, 'timestamp', Number);
		assert.argumentIsOptional(milliseconds, 'milliseconds', Boolean);

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

		return tzOffset(this.code, new Date(timestampToUse)) * multiplier;
	}

	/**
	 * Given a code, returns the corresponding enumeration item.
	 *
	 * @public
	 * @static
	 * @param {string} code
	 * @returns {Timezones|null}
	 */
	static parse(code) {
		const value = Enum.fromCode(Timezones, code);

		return value instanceof Timezones ? value : null;
	}

	/**
	 * UTC.
	 *
	 * @public
	 * @static
	 * @returns {Timezones}
	 */
	static get UTC() {
		return utc;
	}

	/**
	 * America/Chicago.
	 *
	 * @public
	 * @static
	 * @returns {Timezones}
	 */
	static get AMERICA_CHICAGO() {
		return america_chicago;
	}

	/**
	 * America/New_York.
	 *
	 * @public
	 * @static
	 * @returns {Timezones}
	 */
	static get AMERICA_NEW_YORK() {
		return america_new_york;
	}

	/**
	 * America/Denver.
	 *
	 * @public
	 * @static
	 * @returns {Timezones}
	 */
	static get AMERICA_DENVER() {
		return america_denver;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return `[Timezone (name=${this.code})]`;
	}
}

timezone.getTimezones().forEach((name) => { new Timezones(name); });

const utc = getRequiredTimezone('UTC');
const america_chicago = getRequiredTimezone('America/Chicago');
const america_new_york = getRequiredTimezone('America/New_York');
const america_denver = getRequiredTimezone('America/Denver');

/**
 * Returns a registered timezone or throws if it cannot be found.
 *
 * @param {string} code
 * @returns {Timezones}
 */
function getRequiredTimezone(code) {
	const value = Timezones.parse(code);

	if (value === null) {
		throw new Error(`Timezone "${code}" is not registered.`);
	}

	return value;
}