const assert = require('./assert'),
	is = require('./is'),
	memoize = require('./memoize');

const Decimal = require('./Decimal');

module.exports = (() => {
	'use strict';

	class Rate {
		constructor(value, denominator, numerator) {
			assert.argumentIsRequired(numerator, 'numerator', String);
			assert.argumentIsRequired(denominator, 'denominator', String);

			if (numerator === denominator) {
				throw new Error('A rate cannot use two identical currencies.');
			}

			this._decimal = getDecimal(value);
			this._numerator = numerator;
			this._denominator = denominator;
		}

		get decimal() {
			return this._decimal;
		}

		get numerator() {
			return this._numerator;
		}

		get quote() {
			return this._numerator;
		}

		get denominator() {
			return this._denominator;
		}

		get base() {
			return this._denominator;
		}

		formatPair(useCarat) {
			assert.argumentIsOptional(useCarat, 'useCarat', Boolean);

			return `${(useCarat ? '^' : '')}${this._numerator}${this._denominator}`;
		}

		static fromPair(value, pair) {
			assert.argumentIsRequired(pair, 'pair', String);

			return new Rate(value, pair.numerator, pair.denominator);
		}

		toString() {
			return `[Rate]`;
		}
	}

	const pairExpression = /^\^?([A-Z]{3})([A-Z]{3})$/;

	function getDecimal(value) {
		if (value instanceof Decimal) {
			return value;
		} else {
			return new Decimal(value);
		}
	}

	const parsePair = memoize.simple((pair) => {
		const match = pair.match(pairExpression);

		if (match === null) {
			throw new Error('The "pair" argument cannot be parsed.');
		}

		return {
			numerator: match[2],
			denominator: match[1]
		};
	});


	return Rate;
})();
