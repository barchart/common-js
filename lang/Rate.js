const assert = require('./assert'),
	is = require('./is'),
	memoize = require('./memoize');

const Currency = require('./Currency'),
	Decimal = require('./Decimal');

module.exports = (() => {
	'use strict';

	/**
	 * A component that represents an exchange rate, composed of a {@link Decimal}
	 * value and two currencies -- a quote (i.e. the numerator) currency and a
	 * base (i.e. denominator) currency.
	 *
	 * @public
	 * @param {Number|String|Decimal} value - The rate
	 * @param {Currency} numerator - The quote currency
	 * @param {Currency} denominator - The base currency
	 */
	class Rate {
		constructor(value, numerator, denominator) {
			assert.argumentIsRequired(numerator, 'numerator', Currency, 'Currency');
			assert.argumentIsRequired(denominator, 'denominator', Currency, 'Currency');

			if (numerator === denominator) {
				throw new Error('A rate cannot use two identical currencies.');
			}

			this._decimal = getDecimal(value);
			this._numerator = numerator;
			this._denominator = denominator;
		}

		/**
		 * The rate.
		 *
		 * @public
		 * @returns {Decimal}
		 */
		get decimal() {
			return this._decimal;
		}

		/**
		 * The numerator (i.e. quote) currency. In other words,
		 * this is EUR of the EURUSD pair.
		 *
		 * @public
		 * @returns {Currency}
		 */
		get numerator() {
			return this._numerator;
		}

		/**
		 * The quote (i.e. numerator) currency. In other words,
		 * this is EUR of the EURUSD pair.
		 *
		 * @public
		 * @returns {Currency}
		 */
		get quote() {
			return this._numerator;
		}

		/**
		 * The denominator (i.e. base) currency. In other words,
		 * this is USD of the EURUSD pair.
		 *
		 * @public
		 * @returns {Currency}
		 */
		get denominator() {
			return this._denominator;
		}

		/**
		 * The base (i.e. denominator) currency. In other words,
		 * this is USD of the EURUSD pair.
		 *
		 * @public
		 * @returns {Currency}
		 */
		get base() {
			return this._denominator;
		}

		/**
		 * Formats the currency pair as a string (e.g. "EURUSD" or "^EURUSD").
		 *
		 * @public
		 * @param {Boolean=} useCarat - If true, a carat is used as a prefix to the resulting string.
		 * @returns {string}
		 */
		formatPair(useCarat) {
			assert.argumentIsOptional(useCarat, 'useCarat', Boolean);

			return `${(useCarat ? '^' : '')}${this._numerator}${this._denominator}`;
		}

		/**
		 * Creates a {@link Rate} instance, when given a value
		 *
		 * @public
		 * @param {Number|String|Decimal} value - The rate.
		 * @param {Currency} pair - A string that can be parsed as a currency pair.
		 * @returns {Rate}
		 */
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
