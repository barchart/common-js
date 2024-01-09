const assert = require('./assert'),
	Enum = require('./Enum'),
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
		 * Returns a new {@link Decimal} instance with a value that results
		 * from raising the current instance to the power of the exponent
		 * provided.
		 *
		 * @public
		 * @param {Number} exponent
		 * @returns {Decimal}
		 */
		raise(exponent) {
			assert.argumentIsRequired(exponent, 'exponent', Number);

			return new Decimal(this._big.pow(exponent));
		}

		/**
		 * Returns a new {@link Decimal} with a value resulting from a rounding
		 * operation on the current value.
		 *
		 * @public
		 * @param {Number} places - The number of decimal places to retain.
		 * @param {RoundingMode=} mode - The strategy to use for rounding.
		 * @returns {Decimal}
		 */
		round(places, mode) {
			assert.argumentIsRequired(places, 'places', Number);
			assert.argumentIsOptional(mode, 'mode', RoundingMode, 'RoundingMode');

			const modeToUse = mode || RoundingMode.NORMAL;

			return new Decimal(this._big.round(places, modeToUse.value));
		}

		/**
		 * Returns a new {@link Decimal} instance with of the remainder when
		 * dividing the current instance by the value supplied.
		 *
		 * @public
		 * @param {Decimal|Number|String} other
		 * @returns {Decimal}
		 */
		mod(other) {
			return new Decimal(this._big.mod(getBig(other)));
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
		 * @param {Number=} places
		 * @returns {Boolean}
		 */
		getIsZero(approximate, places) {
			assert.argumentIsOptional(approximate, 'approximate', Boolean);
			assert.argumentIsOptional(places, 'places', Number);

			return this._big.eq(zero) || (is.boolean(approximate) && approximate && this.round(places || Big.DP, RoundingMode.NORMAL).getIsZero());
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
		 * @param {Decimal|Number|String} other - The value to compare.
		 * @returns {Boolean}
		 */
		getIsGreaterThan(other) {
			return this._big.gt(getBig(other));
		}

		/**
		 * Returns true if the current instance is greater than or equal to the value.
		 *
		 * @public
		 * @param {Decimal|Number|String} other - The value to compare.
		 * @returns {Boolean}
		 */
		getIsGreaterThanOrEqual(other) {
			return this._big.gte(getBig(other));
		}

		/**
		 * Returns true if the current instance is less than the value.
		 *
		 * @public
		 * @param {Decimal|Number|String} other - The value to compare.
		 * @returns {Boolean}
		 */
		getIsLessThan(other) {
			return this._big.lt(getBig(other));
		}

		/**
		 * Returns true if the current instance is less than or equal to the value.
		 *
		 * @public
		 * @param {Decimal|Number|String} other - The value to compare.
		 * @returns {Boolean}
		 */
		getIsLessThanOrEqual(other) {
			return this._big.lte(getBig(other));
		}

		/**
		 * Returns true if the current instance between two other values. The
		 * test is inclusive, by default.
		 *
		 * @public
		 * @param {Decimal|Number|String} minimum - The minimum value.
		 * @param {Decimal|Number|String} minimum - The maximum value.
		 * @param {Boolean=} exclusive - If true, the value cannot equal the minimum or maximum value and still be considered "between" the other values.
		 * @returns {Boolean}
		 */
		getIsBetween(minimum, maximum, exclusive) {
			assert.argumentIsOptional(exclusive, 'exclusive', Boolean);

			if (is.boolean(exclusive) && exclusive) {
				return this.getIsGreaterThan(minimum) && this.getIsLessThan(maximum);
			} else {
				return this.getIsGreaterThanOrEqual(minimum) && this.getIsLessThanOrEqual(maximum);
			}
		}

		/**
		 * Returns true if the current instance is equal to the value.
		 *
		 * @public
		 * @param {Decimal|Number|String} other - The value to compare.
		 * @returns {Boolean}
		 */
		getIsEqual(other) {
			return this._big.eq(getBig(other));
		}

		/**
		 * Returns true is close to another value.
		 *
		 * @public
		 * @param {Decimal|Number|String} other - The value to compare.
		 * @param {Number} places - The significant digits.
		 * @returns {Boolean}
		 */
		getIsApproximate(other, places) {
			if (places === 0) {
				return this.getIsEqual(other);
			}

			const difference = this.subtract(other).absolute();
			const tolerance = Decimal.ONE.divide(new Decimal(10).raise(places));

			return difference.getIsLessThan(tolerance);
		}

		/**
		 * Returns true if the current instance is an integer (i.e. has no decimal
		 * component).
		 *
		 * @public
		 * @return {Boolean}
		 */
		getIsInteger() {
			return this.getIsEqual(this.round(0));
		}

		/**
		 * Returns the number of decimal places used.
		 *
		 * @public
		 * @returns {Number}
		 */
		getDecimalPlaces() {
			const matches = this.toFixed().match(/-?\d*\.(\d*)/);

			let returnVal;

			if (matches === null) {
				returnVal = 0;
			} else {
				returnVal = matches[1].length;
			}

			return returnVal;
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
		 * Returns a {@link Number} that is approximately equal to the value of
		 * this {@link Decimal} instance.
		 *
		 * @public
		 * @returns {String}
		 */
		toNumber() {
			return this._big.toNumber();
		}


		/**
		 * Returns the JSON representation.
		 *
		 * @public
		 * @returns {String}
		 */
		toJSON() {
			return this.toFixed();
		}

		/**
		 * Clones a {@link Decimal} instance.
		 *
		 * @public
		 * @static
		 * @param {Decimal} value
		 * @returns {Decimal}
		 */
		static clone(value) {
			assert.argumentIsRequired(value, 'value', Decimal, 'Decimal');

			return new Decimal(value._big);
		}

		/**
		 * An alias for the constructor. Creates a new instance. Suitable for
		 * use with the value emitted by {@link Decimal#toJSON}.
		 *
		 * @public
		 * @static
		 * @param {Decimal|Number|String} value
		 * @returns {Decimal}
		 */
		static parse(value) {
			return new Decimal(value);
		}

		/**
		 * Returns an instance with the value of zero.
		 *
		 * @public
		 * @static
		 * @returns {Decimal}
		 */
		static get ZERO() {
			return decimalZero;
		}

		/**
		 * Returns an instance with the value of one.
		 *
		 * @public
		 * @static
		 * @returns {Decimal}
		 */
		static get ONE() {
			return decimalOne;
		}

		/**
		 * Returns an instance with the value of one.
		 *
		 * @public
		 * @static
		 * @returns {Decimal}
		 */
		static get NEGATIVE_ONE() {
			return decimalNegativeOne;
		}

		/**
		 * Return the {@link RoundingMode} enumeration.
		 *
		 * @public
		 * @static
		 * @returns {RoundingMode}
		 */
		static get ROUNDING_MODE() {
			return RoundingMode;
		}

		/**
		 * Runs {@link Decimal#getIsZero} and returns the result.
		 *
		 * @public
		 * @static
		 * @param {Decimal} instance
		 * @returns {Boolean}
		 */
		static getIsZero(instance) {
			assert.argumentIsRequired(instance, 'instance', Decimal, 'Decimal');

			return instance.getIsZero();
		}

		/**
		 * Runs {@link Decimal#getIsZero} and returns the inverse.
		 *
		 * @public
		 * @static
		 * @param {Decimal} instance
		 * @returns {Boolean}
		 */
		static getIsNotZero(instance) {
			assert.argumentIsRequired(instance, 'instance', Decimal, 'Decimal');

			return !instance.getIsZero();
		}

		/**
		 * Runs {@link Decimal#getIsPositive} and returns the result.
		 *
		 * @public
		 * @static
		 * @param {Decimal} instance
		 * @returns {Boolean}
		 */
		static getIsPositive(instance) {
			assert.argumentIsRequired(instance, 'instance', Decimal, 'Decimal');

			return instance.getIsPositive();
		}

		/**
		 * Checks an instance to see if its negative or zero.
		 *
		 * @public
		 * @static
		 * @param {Decimal} instance
		 * @returns {Boolean}
		 */
		static getIsNotPositive(instance) {
			assert.argumentIsRequired(instance, 'instance', Decimal, 'Decimal');

			return instance.getIsNegative() || instance.getIsZero();
		}

		/**
		 * Runs {@link Decimal#getIsNegative} and returns the result.
		 *
		 * @public
		 * @static
		 * @param {Decimal} instance
		 * @returns {Boolean}
		 */
		static getIsNegative(instance) {
			assert.argumentIsRequired(instance, 'instance', Decimal, 'Decimal');

			return instance.getIsNegative();
		}

		/**
		 * Checks an instance to see if its positive or zero.
		 *
		 * @public
		 * @static
		 * @param {Decimal} instance
		 * @returns {Boolean}
		 */
		static getIsNotNegative(instance) {
			assert.argumentIsRequired(instance, 'instance', Decimal, 'Decimal');

			return instance.getIsPositive() || instance.getIsZero();
		}

		/**
		 * A comparator function for {@link Decimal} instances.
		 *
		 * @public
		 * @static
		 * @param {Decimal} a
		 * @param {Decimal} b
		 * @returns {Number}
		 */
		static compareDecimals(a, b) {
			assert.argumentIsRequired(a, 'a', Decimal, 'Decimal');
			assert.argumentIsRequired(b, 'b', Decimal, 'Decimal');

			if (a._big.gt(b._big)) {
				return 1;
			} else if (a._big.lt(b._big)) {
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

	/**
	 * An enumeration of strategies for rounding a {@link Decimal} instance.
	 *
	 * @public
	 * @inner
	 * @extends {Enum}
	 */
	class RoundingMode extends Enum {
		constructor(value, description) {
			super(value.toString(), description);

			this._value = value;
		}

		/**
		 * The code used by the Big.js library.
		 *
		 * @ignore
		 * @returns {Number}
		 */
		get value() {
			return this._value;
		}

		/**
		 * Rounds away from zero.
		 *
		 * @public
		 * @static
		 * @returns {RoundingMode}
		 */
		static get UP() {
			return up;
		}

		/**
		 * Rounds towards zero.
		 *
		 * @public
		 * @static
		 * @returns {RoundingMode}
		 */
		static get DOWN() {
			return down;
		}

		/**
		 * Rounds towards nearest neighbor. If equidistant, rounds away from zero.
		 *
		 * @public
		 * @static
		 * @returns {RoundingMode}
		 */
		static get NORMAL() {
			return normal;
		}

		toString() {
			return '[RoundingMode]';
		}
	}

	const up = new RoundingMode(3, 'up');
	const down = new RoundingMode(0, 'down');
	const normal = new RoundingMode(1, 'normal');

	return Decimal;
})();
