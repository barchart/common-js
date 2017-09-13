const assert = require('./assert'),
	is = require('./is'),
	memoize = require('./memoize');

const Currency = require('./Currency'),
	Decimal = require('./Decimal'),
	Enum = require('./Enum');

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

			const decimal = getDecimal(value);

			if (!decimal.getIsPositive()) {
				throw new Error('Rate value must be positive.');
			}

			this._decimal = decimal;
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
		 * Returns the equivalent rate with the numerator and denominator (i.e. the qoute and base)
		 * currencies.
		 *
		 * @public
		 * @returns {Rate}
		 */
		invert() {
			return new Rate(Decimal.ONE.divide(this._decimal), this._denominator, this._numerator);
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
		 * @param {String} symbol - A string that can be parsed as a currency pair.
		 * @returns {Rate}
		 */
		static fromPair(value, symbol) {
			assert.argumentIsRequired(symbol, 'symbol', String);

			const pair = parsePair(symbol);

			return new Rate(value, Currency.parse(pair.numerator), Currency.parse(pair.denominator));
		}

		/**
		 * Given a {@link Decimal} value in a known currency, output
		 * a {@link Decimal} converted to an alternate currency.
		 *
		 * @public
		 * @param {Decimal} amount - The amount to convert.
		 * @param {Currency} currency - The currency of the amount.
		 * @param {Currency} desiredCurrency - The currency to convert to.
		 * @param {...Rate} rates - A list of exchange rates to be used for the conversion.
		 * @returns {Decimal}
		 */
		static convert(amount, currency, desiredCurrency, ...rates) {
			assert.argumentIsRequired(amount, 'amount', Decimal, 'Decimal');
			assert.argumentIsRequired(currency, 'currency', Currency, 'Currency');
			assert.argumentIsRequired(desiredCurrency, 'desiredCurrency', Currency, 'Currency');
			assert.argumentIsArray(rates, 'rates', Rate, 'Rate');

			let converted;

			if (currency === desiredCurrency) {
				converted = amount;
			} else {
				const numerator = desiredCurrency;
				const denominator = currency;

				let rate = rates.find(r => (r.numerator === numerator && r.denominator === denominator) || (r.numerator === denominator && r.denominator === numerator));

				if (rate) {
					if (rate.numerator === denominator) {
						rate = rate.invert();
					}
				}

				if (!rate) {
					throw new Error('Unable to perform conversion, given the rates provided.');
				}

				converted = amount.multiply(rate.decimal);
			}

			return converted;
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

	const parsePair = memoize.simple((symbol) => {
		const match = symbol.match(pairExpression);

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
