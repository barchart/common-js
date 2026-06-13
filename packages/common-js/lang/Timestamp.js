const assert = require('./assert'),
	is = require('./is');

module.exports = (() => {
	'use strict';

	const MILLISECONDS_PER_SECOND = 1000;

	/**
	 * An immutable data structure that encapsulates a unix timestamp (in
	 * milliseconds).
	 *
	 * @public
	 * @param {Number} timestamp
	 */
	class Timestamp {
		constructor(timestamp, timezone) {
			assert.argumentIsValid(timestamp, 'timestamp', is.large, 'is an integer');

			this._timestamp = timestamp;
		}

		/**
		 * The timestamp (milliseconds since epoch).
		 *
		 * @public
		 * @returns {Number}
		 */
		get timestamp() {
			return this._timestamp;
		}

		/**
		 * Returns a new {@link Timestamp} instance shifted forward (or backward)
		 * by a specific number of milliseconds.
		 *
		 * @public
		 * @param {Number} milliseconds
		 * @returns {Timestamp}
		 */
		add(milliseconds) {
			assert.argumentIsRequired(milliseconds, 'milliseconds', Number);

			return new Timestamp(this._timestamp + milliseconds);
		}

		/**
		 * Returns a new {@link Timestamp} instance shifted forward (or backward)
		 * by a specific number of seconds.
		 *
		 * @public
		 * @param {Number} seconds
		 * @returns {Timestamp}
		 */
		addSeconds(seconds) {
			assert.argumentIsRequired(seconds, 'seconds', Number);

			return this.add(seconds * MILLISECONDS_PER_SECOND);
		}

		/**
		 * Indicates if the current {@link Timestamp} instance occurs before another timestamp.
		 *
		 * @public
		 * @param {Timestamp} other
		 * @returns {boolean}
		 */
		getIsBefore(other) {
			return Timestamp.compareTimestamps(this, other) < 0;
		}

		/**
		 * Indicates if the current {@link Timestamp} instance occurs after another timestamp.
		 *
		 * @public
		 * @param {Timestamp} other
		 * @returns {boolean}
		 */
		getIsAfter(other) {
			return Timestamp.compareTimestamps(this, other) > 0;
		}

		/**
		 * Indicates if another {@link Timestamp} refers to the same moment.
		 *
		 * @public
		 * @param {Timestamp} other
		 * @returns {boolean}
		 */
		getIsEqual(other) {
			return Timestamp.compareTimestamps(this, other) === 0;
		}

		/**
		 * Returns the JSON representation.
		 *
		 * @public
		 * @returns {Number}
		 */
		toJSON() {
			return this.timestamp;
		}

		/**
		 * Clones a {@link Timestamp} instance.
		 *
		 * @public
		 * @static
		 * @param {Timestamp} value
		 * @returns {Timestamp}
		 */
		static clone(value) {
			assert.argumentIsRequired(value, 'value', Timestamp, 'Timestamp');

			return new Timestamp(value._timestamp, value._timezone);
		}

		/**
		 * Parses the value emitted by {@link Timestamp#toJSON}.
		 *
		 * @public
		 * @static
		 * @param {Number} value
		 * @returns {Timestamp}
		 */
		static parse(value) {
			return new Timestamp(value);
		}

		/**
		 * Returns a new {@link Timestamp} instance, representing the current moment.
		 *
		 * @public
		 * @static
		 * @returns {Timestamp}
		 */
		static now() {
			return new Timestamp((new Date()).getTime());
		}

		/**
		 * A comparator function for {@link Day} instances.
		 *
		 * @public
		 * @static
		 * @param {Timestamp} a
		 * @param {Timestamp} b
		 * @returns {Number}
		 */
		static compareTimestamps(a, b) {
			assert.argumentIsRequired(a, 'a', Timestamp, 'Timestamp');
			assert.argumentIsRequired(b, 'b', Timestamp, 'Timestamp');

			return a.timestamp - b.timestamp;
		}

		toString() {
			return '[Timestamp]';
		}
	}

	return Timestamp;
})();
