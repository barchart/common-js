import * as assert from './assert.js';
import * as is from './is.js';

import Enum from './Enum.js';
import Big from 'big.js';

/**
 * An immutable object that allows for arbitrary-precision calculations.
 *
 * @public
 */
export default class Decimal {
	#big;

	/**
	 * @param {Decimal|number|string} value - The value.
	 */
	constructor(value) {
		this.#big = Decimal.#getBig(value);
	}

	/**
	 * Returns a new {@link Decimal} instance that is the sum of the
	 * current instance's value and the value supplied.
	 *
	 * @public
	 * @param {Decimal|number|string} other - The value to add.
	 * @returns {Decimal}
	 */
	add(other) {
		return new Decimal(this.#big.plus(Decimal.#getBig(other)));
	}

	/**
	 * Returns a new {@link Decimal} instance with a value that results
	 * from the subtraction of the value supplied from the current instance's
	 * value.
	 *
	 * @public
	 * @param {Decimal|number|string} other - The value to subtract.
	 * @returns {Decimal}
	 */
	subtract(other) {
		return new Decimal(this.#big.minus(Decimal.#getBig(other)));
	}

	/**
	 * Returns a new {@link Decimal} instance that is the product of the
	 * current instance's value and the value supplied.
	 *
	 * @public
	 * @param {Decimal|number|string} other - The value to multiply the current instance by.
	 * @returns {Decimal}
	 */
	multiply(other) {
		return new Decimal(this.#big.times(Decimal.#getBig(other)));
	}

	/**
	 * Returns a new {@link Decimal} instance with a value that results
	 * from the division of the current instance's value by the value
	 * supplied.
	 *
	 * @public
	 * @param {Decimal|number|string} other - The value to divide the current instance by.
	 * @returns {Decimal}
	 */
	divide(other) {
		return new Decimal(this.#big.div(Decimal.#getBig(other)));
	}

	/**
	 * Returns a new {@link Decimal} instance with a value that results
	 * from raising the current instance to the power of the exponent
	 * provided.
	 *
	 * @public
	 * @param {number} exponent
	 * @returns {Decimal}
	 */
	raise(exponent) {
		assert.argumentIsRequired(exponent, 'exponent', Number);

		return new Decimal(this.#big.pow(exponent));
	}

	/**
	 * Returns a new {@link Decimal} with a value resulting from a rounding
	 * operation on the current value.
	 *
	 * @public
	 * @param {number} places - The number of decimal places to retain.
	 * @param {RoundingMode=} mode - The strategy to use for rounding.
	 * @returns {Decimal}
	 */
	round(places, mode) {
		assert.argumentIsRequired(places, 'places', Number);
		assert.argumentIsOptional(mode, 'mode', RoundingMode, 'RoundingMode');

		const modeToUse = mode || RoundingMode.NORMAL;

		return new Decimal(this.#big.round(places, modeToUse.value));
	}

	/**
	 * Returns a new {@link Decimal} instance with of the remainder when
	 * dividing the current instance by the value supplied.
	 *
	 * @public
	 * @param {Decimal|number|string} other
	 * @returns {Decimal}
	 */
	mod(other) {
		return new Decimal(this.#big.mod(Decimal.#getBig(other)));
	}

	/**
	 * Returns a new {@link Decimal} instance having the absolute value of
	 * the current instance's value.
	 *
	 * @public
	 * @returns {Decimal}
	 */
	absolute() {
		return new Decimal(this.#big.abs());
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
	 * Returns a boolean value, indicating if the current instance's value is
	 * equal to zero (or approximately equal to zero).
	 *
	 * @public
	 * @param {boolean=} approximate
	 * @param {number=} places
	 * @returns {boolean}
	 */
	getIsZero(approximate, places) {
		assert.argumentIsOptional(approximate, 'approximate', Boolean);
		assert.argumentIsOptional(places, 'places', Number);

		return this.#big.eq(zero) || (is.boolean(approximate) && approximate && this.round(places || Big.DP, RoundingMode.NORMAL).getIsZero());
	}

	/**
	 * Returns true if the current instance is positive; otherwise false.
	 *
	 * @public
	 * @returns {boolean}
	 */
	getIsPositive() {
		return this.#big.gt(zero);
	}

	/**
	 * Returns true if the current instance is negative; otherwise false.
	 *
	 * @public
	 * @returns {boolean}
	 */
	getIsNegative() {
		return this.#big.lt(zero);
	}

	/**
	 * Returns true if the current instance is greater than the value.
	 *
	 * @public
	 * @param {Decimal|number|string} other - The value to compare.
	 * @returns {boolean}
	 */
	getIsGreaterThan(other) {
		return this.#big.gt(Decimal.#getBig(other));
	}

	/**
	 * Returns true if the current instance is greater than or equal to the value.
	 *
	 * @public
	 * @param {Decimal|number|string} other - The value to compare.
	 * @returns {boolean}
	 */
	getIsGreaterThanOrEqual(other) {
		return this.#big.gte(Decimal.#getBig(other));
	}

	/**
	 * Returns true if the current instance is less than the value.
	 *
	 * @public
	 * @param {Decimal|number|string} other - The value to compare.
	 * @returns {boolean}
	 */
	getIsLessThan(other) {
		return this.#big.lt(Decimal.#getBig(other));
	}

	/**
	 * Returns true if the current instance is less than or equal to the value.
	 *
	 * @public
	 * @param {Decimal|number|string} other - The value to compare.
	 * @returns {boolean}
	 */
	getIsLessThanOrEqual(other) {
		return this.#big.lte(Decimal.#getBig(other));
	}

	/**
	 * Returns true if the current instance between two other values. The
	 * test is inclusive, by default.
	 *
	 * @public
	 * @param {Decimal|number|string} minimum - The minimum value.
	 * @param {Decimal|number|string} maximum - The maximum value.
	 * @param {boolean=} exclusive - If true, the value cannot equal the minimum or maximum value and still be considered "between" the other values.
	 * @returns {boolean}
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
	 * @param {Decimal|number|string} other - The value to compare.
	 * @returns {boolean}
	 */
	getIsEqual(other) {
		return this.#big.eq(Decimal.#getBig(other));
	}

	/**
	 * Returns true is close to another value.
	 *
	 * @public
	 * @param {Decimal|number|string} other - The value to compare.
	 * @param {number} places - The significant digits.
	 * @returns {boolean}
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
	 * @return {boolean}
	 */
	getIsInteger() {
		return this.getIsEqual(this.round(0));
	}

	/**
	 * Returns the number of decimal places used.
	 *
	 * @public
	 * @returns {number}
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
	 * @param {number=} places
	 * @returns {number}
	 */
	toFloat(places) {
		assert.argumentIsOptional(places, 'places', Number);

		// Accepting places might be a mistake here; perhaps
		// the consumer should be forced to use the round
		// function.

		return parseFloat(this.#big.toFixed(places || 16));
	}

	/**
	 * Returns a string-based representation of the instance's value.
	 *
	 * @public
	 * @returns {string}
	 */
	toFixed() {
		return this.#big.toFixed();
	}

	/**
	 * Returns a {@link number} that is approximately equal to the value of
	 * this {@link Decimal} instance.
	 *
	 * @public
	 * @returns {number}
	 */
	toNumber() {
		return this.#big.toNumber();
	}

	/**
	 * Returns the JSON representation.
	 *
	 * @public
	 * @returns {string}
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

		return new Decimal(value.#big);
	}

	/**
	 * An alias for the constructor. Creates a new instance. Suitable for
	 * use with the value emitted by {@link Decimal#toJSON}.
	 *
	 * @public
	 * @static
	 * @param {Decimal|number|string} value
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
	 * Returns the {@link RoundingMode} enumeration type.
	 *
	 * @public
	 * @static
	 * @returns {typeof RoundingMode}
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
	 * @returns {boolean}
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
	 * @returns {boolean}
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
	 * @returns {boolean}
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
	 * @returns {boolean}
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
	 * @returns {boolean}
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
	 * @returns {boolean}
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
	 * @returns {number}
	 */
	static compareDecimals(a, b) {
		assert.argumentIsRequired(a, 'a', Decimal, 'Decimal');
		assert.argumentIsRequired(b, 'b', Decimal, 'Decimal');

		if (a.#big.gt(b.#big)) {
			return 1;
		} else if (a.#big.lt(b.#big)) {
			return -1;
		} else {
			return 0;
		}
	}

	static #getBig(value) {
		if (value instanceof Big) {
			return value;
		} else if (value instanceof Decimal) {
			return value.#big;
		} else {
			return new Big(value);
		}
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
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

/**
 * An enumeration of strategies for rounding a {@link Decimal} instance.
 *
 * @public
 * @inner
 * @extends {Enum}
 */
class RoundingMode extends Enum {
	#value;

	/**
     * @param {number} value
     * @param {string} description
     */
	constructor(value, description) {
		super(value.toString(), description);

		this.#value = value;
	}

	/**
	 * The code used by the Big.js library.
	 *
	 * @ignore
	 * @returns {number}
	 */
	get value() {
		return this.#value;
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
