const assert = require('./assert'),
	is = require('./is');

const Big = require('big.js');

module.exports = (() => {
	'use strict';

	/**
	 * An immutable object that allows for arbitrary-precision calculations.
	 *
	 * @public
	 * @param {Decimal|Number|String} value - The value.
	 */
	class Decimal {
		constructor(value) {
			this._big = getBig(value);
		}

		/**
		 * Returns a new {@link Decimal} instance that is the sum of the
		 * current instance's value and the value supplied.
		 *
		 * @public
		 * @param {Decimal|Number|String} other - The value to add.
		 * @returns {Decimal}
		 */
		add(other) {
			return new Decimal(this._big.plus(getBig(other)));
		}

		/**
		 * Returns a new {@link Decimal} instance with a value that results
		 * from the subtraction of the value supplied from the current instance's
		 * value.
		 *
		 * @public
		 * @param {Decimal|Number|String} other - The value to subtract.
		 * @returns {Decimal}
		 */
		subtract(other) {
			return new Decimal(this._big.minus(getBig(other)));
		}

		/**
		 * Returns a new {@link Decimal} instance that is the product of the
		 * current instance's value and the value supplied.
		 *
		 * @public
		 * @param {Decimal|Number|String} other - The value to add.
		 * @returns {Decimal}
		 */
		multiply(other) {
			return new Decimal(this._big.times(getBig(other)));
		}

		/**
		 * Returns a new {@link Decimal} instance with a value that results
		 * from the division of the current instance's value by the value
		 * supplied.
		 *
		 * @public
		 * @param {Decimal|Number|String} other - The value to subtract.
		 * @returns {Decimal}
		 */
		divide(other) {
			return new Decimal(this._big.div(getBig(other)));
		}

		/**
		 * Returns a new {@link Decimal} with a value resulting from a rounding
		 * operation on the current value.
		 *
		 * @public
		 * @param {Number} places - The number of decimal places to retain.
		 * @param {RoundingMode} mode - The strategy to use for rounding.
		 * @returns {Decimal}
		 */
		round(places, mode) {
			assert.argumentIsRequired(places, 'places', Number);
			assert.argumentIsRequired(mode, 'mode', RoundingMode, 'RoundingMode');

			return new Decimal(this._big.round(places, mode.code));
		}

		/**
		 * Returns a new {@link Decimal} instance having the absolute value of
		 * the current instance's value.
		 *
		 * @public
		 * @returns {Decimal}
		 */
		absolute() {
			return new Decimal(this._big.abs());
		}

		/**
		 * Returns a new {@link Decimal} instance the opposite sign as the
		 * current instance's value.
		 *
		 * @public
		 * @returns {Decimal}
		 */
		opposite() {
			return this.multiply(-1);
		}

		/**
		 * Returns a Boolean value, indicating if the current instance's value is
		 * equal to zero (or approximately equal to zero).
		 *
		 * @public
		 * @param {Boolean=} approximate
		 * @returns {Boolean}
		 */
		getIsZero(approximate) {
			assert.argumentIsOptional(approximate, 'approximate', Boolean);

			return this._big.eq(zero) || (is.boolean(approximate) && approximate && this.round(20, RoundingMode.NORMAL).getIsZero());
		}

		/**
		 * Returns true if the current instance is positive; otherwise false.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		getIsPositive() {
			return this._big.gt(zero);
		}

		/**
		 * Returns true if the current instance is negative; otherwise false.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		getIsNegative() {
			return this._big.lt(zero);
		}

		/**
		 * Returns true if the current instance is greater than the value.
		 *
		 * @public
		 * @param {Decimal|Number|String} value - The value to compare.
		 * @returns {Boolean}
		 */
		getIsGreaterThan(other) {
			return this._big().gt(getBig(other));
		}

		/**
		 * Returns true if the current instance is less than the value.
		 *
		 * @public
		 * @param {Decimal|Number|String} value - The value to compare.
		 * @returns {Boolean}
		 */
		getIsLessThan(other) {
			return this._big().lt(getBig(other));
		}

		/**
		 * Returns true if the current instance is equal to the value.
		 *
		 * @public
		 * @param {Decimal|Number|String} value - The value to compare.
		 * @returns {Boolean}
		 */
		getIsEqual(other) {
			return this._big().eq(getBig(other));
		}

		/**
		 * Emits a floating point value that approximates the value of the current
		 * instance.
		 *
		 * @public
		 * @param {Number=} places
		 * @returns {Number}
		 */
		toFloat(places) {
			assert.argumentIsOptional(places, 'places', Number);

			// Accepting places might be a mistake here; perhaps
			// the consumer should be forced to use the round
			// function.

			return parseFloat(this._big.toFixed(places || 16));
		}

		/**
		 * Returns a string-based representation of the instance's value.
		 *
		 * @public
		 * @returns {String}
		 */
		toFixed() {
			return this._big.toFixed();
		}

		/**
		 * Returns an instance with the value of zero.
		 *
		 * @returns {Decimal}
		 */
		static get ZERO() {
			return decimalZero;
		}

		/**
		 * Returns an instance with the value of one.
		 *
		 * @returns {Decimal}
		 */
		static get ONE() {
			return decimalOne;
		}

		/**
		 * Returns an instance with the value of one.
		 *
		 * @returns {Decimal}
		 */
		static get NEGATIVE_ONE() {
			return decimalNegativeOne;
		}

		/**
		 * @public
		 * @returns {RoundingMode}
		 * @constructor
		 */
		static get ROUNDING_MODE() {
			return RoundingMode;
		}

		/**
		 * Runs {@link Decimal#getIsPositive} and returns the result.
		 *
		 * @param {Decimal} instance
		 */
		static getIsPositive(instance) {
			assert.argumentIsRequired(instance, 'instance', Decimal, 'Decimal');

			return instance.getIsPositive();
		}

		/**
		 * Checks an instance to see if its negative or zero.
		 *
		 * @param {Decimal} instance
		 */
		static getIsNotPositive(instance) {
			assert.argumentIsRequired(instance, 'instance', Decimal, 'Decimal');

			return instance.getIsNegative() || instance.getIsZero();
		}

		/**
		 * Runs {@link Decimal#getIsNegative} and returns the result.
		 *
		 * @param {Decimal} instance
		 */
		static getIsNegative(instance) {
			assert.argumentIsRequired(instance, 'instance', Decimal, 'Decimal');

			return instance.getIsNegative();
		}

		/**
		 * Checks an instance to see if its positive or zero.
		 *
		 * @param {Decimal} instance
		 */
		static getIsNotNegative(instance) {
			assert.argumentIsRequired(instance, 'instance', Decimal, 'Decimal');

			return instance.getIsPositive() || instance.getIsZero();
		}

		/**
		 * A comparator function for {@link Decimal} instances.
		 *
		 * @public
		 * @param {Decimal} a
		 * @param {Decimal} b
		 * @returns {Number}
		 */
		static compareDecimals(a, b) {
			assert.argumentIsRequired(a, 'a', Decimal, 'Decimal');
			assert.argumentIsRequired(b, 'b', Decimal, 'Decimal');

			if (a._big.gt(b)) {
				return 1;
			} else if (a._big.lt(b)) {
				return -1;
			} else {
				return 0;
			}
		}

		toString() {
			return '[Decimal]';
		}
	}

	const zero = new Big(0);
	const positiveOne = new Big(1);
	const negativeOne = new Big(-1);

	const decimalZero = new Decimal(zero);
	const decimalOne = new Decimal(positiveOne);
	const decimalNegativeOne = new Decimal(negativeOne);

	function getBig(value) {
		if (value instanceof Big) {
			return value;
		} else if (value instanceof Decimal) {
			return value._big;
		} else {
			return new Big(value);
		}
	}

	class RoundingMode {
		constructor(description, code) {
			this._description = description;
			this._code = code;
		}

		/**
		 * Description of the rounding mode.
		 *
		 * @returns {String}
		 */
		get description() {
			return this._description;
		}

		/**
		 * Code assigned to rounding mode.
		 *
		 * @returns {Number}
		 */
		get code() {
			return this._code;
		}

		/**
		 * Rounds away from zero.
		 *
		 * @returns {RoundingMode}
		 */
		static get UP() {
			return up;
		}

		/**
		 * Rounds towards zero.
		 *
		 * @returns {RoundingMode}
		 */
		static get DOWN() {
			return down;
		}

		/**
		 * Rounds towards nearest neighbor. If equidistant, rounds away from zero.
		 *
		 * @returns {RoundingMode}
		 */
		static get NORMAL() {
			return normal;
		}

		toString() {
			return '[RoundingMode]';
		}
	}

	const up = new RoundingMode('up', 3);
	const down = new RoundingMode('down', 0);
	const normal = new RoundingMode('normal', 1);

	return Decimal;
})();
