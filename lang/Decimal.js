const assert = require('./assert'),
	is = require('./is');

const Big = require('big.js');

module.exports = (() => {
	'use strict';

	/**
	 * An immutable object that allows for arbitrary-precision calculations.
	 *
	 * @public
	 */
	class Decimal {
		constructor(value) {
			this._big = getBig(value);
		}

		add(other) {
			return new Decimal(this._big.plus(getBig(other)));
		}

		subtract(other) {
			return new Decimal(this._big.minus(getBig(other)));
		}

		multiply(other) {
			return new Decimal(this._big.times(getBig(other)));
		}

		divide(other) {
			return new Decimal(this._big.div(getBig(other)));
		}

		round(places, mode) {
			assert.argumentIsRequired(places, 'places', Number);
			assert.argumentIsRequired(mode, 'mode', RoundingMode, 'RoundingMode');

			return new Decimal(this._big.round(places, mode.code));
		}

		getIsZero(approximate) {
			assert.argumentIsOptional(approximate, 'approximate', Boolean);

			return this._big.eq(zero) || (is.boolean(approximate) && approximate && this.round(20, RoundingMode.NORMAL).getIsZero());
		}

		getIsPositive() {
			return this._big.gt(zero);
		}

		getIsNegative() {
			return this._big.lt(zero);
		}

		toFloat(places) {
			assert.argumentIsOptional(places, 'places', Number);

			return parseFloat(this._big.toFixed(places || 16));
		}

		toFixed() {
			return this._big.toFixed();
		}

		static get ZERO() {
			return decimalZero;
		}

		static get ROUNDING_MODE() {
			return RoundingMode;
		}

		toString() {
			return '[Decimal]';
		}
	}

	const zero = new Big(0);
	const positiveOne = new Big(1);
	const negativeOne = new Big(-1);

	function getBig(value) {
		if (value instanceof Big) {
			return value;
		} else if (value instanceof Decimal) {
			return value._big;
		} else {
			return new Big(value);
		}
	}

	const decimalZero = new Decimal(0);

	class RoundingMode {
		constructor(description, code) {
			this._description = description;
			this._code = code;
		}

		get description() {
			return this._description;
		}

		get code() {
			return this._code;
		}

		static get UP() {
			return up;
		}

		static get DOWN() {
			return down;
		}

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
