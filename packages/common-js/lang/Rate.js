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

			if (is.number(value)) {
				this._decimal = null;
				this._float = value;
			} else if (value instanceof Decimal) {
				this._decimal = value;
				this._float = null;
			} else {
				this._decimal = new Decimal(value);
				this._float = null;
			}

			if ((this._float !== null && !(this._float > 0)) || (this._decimal !== null && !this._decimal.getIsPositive())) {
				throw new Error('Rate value must be positive.');
			}

			this._numerator = numerator;
			this._denominator = denominator;
		}

		/**
		 * The rate (as a {@link Decimal} instance.
		 *
		 * @public
		 * @returns {Decimal}
		 */
		get decimal() {
			if (this._decimal === null) {
				this._decimal = new Decimal(this.float);
			}

			return this._decimal;
		}

		/**
		 * The rate (as a floating point number).
		 *
		 * @public
		 * @returns {Number}
		 */
		get float() {
			if (this._float === null) {
				this._float = this._decimal.toNumber();
			}

			return this._float;
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
			let inverted;

			if (this._decimal === null) {
				inverted = 1 / this._float;
			} else {
				inverted = Decimal.ONE.divide(this.decimal);
			}

			return new Rate(inverted, this._denominator, this._numerator);
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

			return `${(useCarat ? '^' : '')}${this._numerator.code}${this._denominator.code}`;
		}

		/**
		 * Returns the Barchart symbol for the exchange rate.
		 *
		 * @public
		 * @return {string}
		 */
		getSymbol() {
			return `^${this.denominator.code}${this.numerator.code}`;
		}

		/**
		 * Creates a {@link Rate} instance, when given a value
		 *
		 * @public
		 * @static
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
		 * @static
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

			if (currency === desiredCurrency) {
				return amount;
			}

			if (currency === Currency.GBX) {
				const gbp = convert(amount, Currency.GBX, Currency.GBP, [ GBPGBX ]);

				return convert(gbp, Currency.GBP, desiredCurrency, rates);
			}

			if (desiredCurrency === Currency.GBX) {
				const gbp = convert(amount, currency, Currency.GBP, [ GBXGBP, ...rates ]);

				return convert(gbp, Currency.GBP, Currency.GBX, [ GBXGBP ]);
			}

			return convert(amount, currency, desiredCurrency, rates);
		}

		/**
		 * Returns a list of rates which do no change.
		 *
		 * @public
		 * @static
		 * @returns {Rate[]}
		 */
		static getStaticRates() {
			return [ new Rate(GBXGBP.float, GBXGBP.numerator, GBXGBP.denominator) ];
		}

		toString() {
			return `[Rate]`;
		}
	}

	const pairExpression = /^\^?([A-Z]{3})([A-Z]{3})$/;

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

	function convert(amount, currency, desiredCurrency, rates) {
		if (currency === desiredCurrency) {
			return amount;
		}

		const numerator = desiredCurrency;
		const denominator = currency;

		let rate = rates.find(r => (r.numerator === numerator && r.denominator === denominator) || (r.numerator === denominator && r.denominator === numerator));

		if (rate && rate.numerator === denominator) {
			rate = rate.invert();
		}

		if (!rate) {
			throw new Error('Unable to perform conversion, given the rates provided.');
		}

		return amount.multiply(rate.decimal);
	}

	const GBPGBX = Rate.fromPair(100, '^GBPGBX');
	const GBXGBP = Rate.fromPair(0.01, '^GBXGBP');

	return Rate;
})();
