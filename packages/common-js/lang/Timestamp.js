import * as assert from './assert.js';
import * as is from './is.js';

const MILLISECONDS_PER_SECOND = 1000;

/**
 * An immutable data structure that encapsulates a Unix timestamp (in
 * milliseconds).
 *
 * @public
 */
export default class Timestamp {
	#timestamp;

	/**
	 * @param {number} timestamp
	 */
	constructor(timestamp) {
		assert.argumentIsValid(timestamp, 'timestamp', is.large, 'is an integer');

		this.#timestamp = timestamp;
	}

	/**
	 * The timestamp (milliseconds since epoch).
	 *
	 * @public
	 * @returns {number}
	 */
	get timestamp() {
		return this.#timestamp;
	}

	/**
	 * Returns a new {@link Timestamp} instance shifted forward by a specific
	 * number of milliseconds.
	 *
	 * @public
	 * @param {number} milliseconds
	 * @returns {Timestamp}
	 */
	add(milliseconds) {
		assert.argumentIsRequired(milliseconds, 'milliseconds', Number);

		return new Timestamp(this.#timestamp + milliseconds);
	}

	/**
	 * Returns a new {@link Timestamp} instance shifted backwards by a specific
	 * number of milliseconds.
	 *
	 * @public
	 * @param {number} milliseconds
	 * @returns {Timestamp}
	 */
	subtract(milliseconds) {
		assert.argumentIsRequired(milliseconds, 'milliseconds', Number);

		return new Timestamp(this.#timestamp - milliseconds);
	}

	/**
	 * Returns a new {@link Timestamp} instance shifted forward by a specific
	 * number of seconds.
	 *
	 * @public
	 * @param {number} seconds
	 * @returns {Timestamp}
	 */
	addSeconds(seconds) {
		assert.argumentIsRequired(seconds, 'seconds', Number);

		return this.add(seconds * MILLISECONDS_PER_SECOND);
	}

	/**
	 * Returns a new {@link Timestamp} instance shifted backwards by a specific
	 * number of seconds.
	 *
	 * @public
	 * @param {number} seconds
	 * @returns {Timestamp}
	 */
	subtractSeconds(seconds) {
		assert.argumentIsRequired(seconds, 'seconds', Number);

		return this.subtract(seconds * MILLISECONDS_PER_SECOND);
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
	 * @returns {number}
	 */
	toJSON() {
		return this.timestamp;
	}

	/**
	 * Clones a {@link Timestamp} instance.
	 *
	 * @public
	 * @static
	 * @param {Timestamp} other
	 * @returns {Timestamp}
	 */
	static clone(other) {
		assert.argumentIsRequired(other, 'other', Timestamp, 'Timestamp');

		return new Timestamp(other.#timestamp);
	}

	/**
	 * Parses the value emitted by {@link Timestamp#toJSON}.
	 *
	 * @public
	 * @static
	 * @param {number} value
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
	 * A comparator function for {@link Timestamp} instances.
	 *
	 * @public
	 * @static
	 * @param {Timestamp} a
	 * @param {Timestamp} b
	 * @returns {number}
	 */
	static compareTimestamps(a, b) {
		assert.argumentIsRequired(a, 'a', Timestamp, 'Timestamp');
		assert.argumentIsRequired(b, 'b', Timestamp, 'Timestamp');

		return a.timestamp - b.timestamp;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[Timestamp]';
	}
}
