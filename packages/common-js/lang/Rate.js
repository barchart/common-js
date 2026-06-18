import * as assert from './assert.js';
import * as is from './is.js';
import * as memoize from './memoize.js';

import Currency from './Currency.js';
import Decimal from './Decimal.js';

/**
 * A component that represents an exchange rate, composed of a {@link Decimal}
 * value and two currencies -- a quote (i.e. the numerator) currency and a
 * base (i.e. denominator) currency.
 *
 * @public
 */
export default class Rate {
	#decimal;
	#float;
	#numerator;
	#denominator;

	/**
	 * @param {number|string|Decimal} value - The rate
	 * @param {Currency} numerator - The quote currency
	 * @param {Currency} denominator - The base currency
	 */
	constructor(value, numerator, denominator) {
		assert.argumentIsRequired(numerator, 'numerator', Currency, 'Currency');
		assert.argumentIsRequired(denominator, 'denominator', Currency, 'Currency');

		if (numerator === denominator) {
			throw new Error('A rate cannot use two identical currencies.');
		}

		if (is.number(value)) {
			this.#decimal = null;
			this.#float = value;
		} else if (value instanceof Decimal) {
			this.#decimal = value;
			this.#float = null;
		} else {
			this.#decimal = new Decimal(value);
			this.#float = null;
		}

		if ((this.#float !== null && !(this.#float > 0)) || (this.#decimal !== null && !this.#decimal.getIsPositive())) {
			throw new Error('Rate value must be positive.');
		}

		this.#numerator = numerator;
		this.#denominator = denominator;
	}

	/**
	 * The rate (as a {@link Decimal}) instance.
	 *
	 * @public
	 * @returns {Decimal}
	 */
	get decimal() {
		if (this.#decimal === null) {
			this.#decimal = new Decimal(this.float);
		}

		return this.#decimal;
	}

	/**
	 * The rate (as a floating point number).
	 *
	 * @public
	 * @returns {number}
	 */
	get float() {
		if (this.#float === null) {
			this.#float = this.#decimal.toNumber();
		}

		return this.#float;
	}

	/**
	 * The numerator (i.e. quote) currency. In other words,
	 * this is EUR of the EURUSD pair.
	 *
	 * @public
	 * @returns {Currency}
	 */
	get numerator() {
		return this.#numerator;
	}

	/**
	 * The quote (i.e. numerator) currency. In other words,
	 * this is EUR of the EURUSD pair.
	 *
	 * @public
	 * @returns {Currency}
	 */
	get quote() {
		return this.#numerator;
	}

	/**
	 * The denominator (i.e. base) currency. In other words,
	 * this is USD of the EURUSD pair.
	 *
	 * @public
	 * @returns {Currency}
	 */
	get denominator() {
		return this.#denominator;
	}

	/**
	 * The base (i.e. denominator) currency. In other words,
	 * this is USD of the EURUSD pair.
	 *
	 * @public
	 * @returns {Currency}
	 */
	get base() {
		return this.#denominator;
	}

	/**
	 * Returns the equivalent rate with the numerator and denominator (i.e. the quote and base)
	 * currencies.
	 *
	 * @public
	 * @returns {Rate}
	 */
	invert() {
		let inverted;

		if (this.#decimal === null) {
			inverted = 1 / this.#float;
		} else {
			inverted = Decimal.ONE.divide(this.decimal);
		}

		return new Rate(inverted, this.#denominator, this.#numerator);
	}

	/**
	 * Formats the currency pair as a string (e.g. "EURUSD" or "^EURUSD").
	 *
	 * @public
	 * @param {boolean=} useCarat - If true, a carat is used as a prefix to the resulting string.
	 * @returns {string}
	 */
	formatPair(useCarat) {
		assert.argumentIsOptional(useCarat, 'useCarat', Boolean);

		return `${(useCarat ? '^' : '')}${this.#numerator.code}${this.#denominator.code}`;
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
	 * @param {number|string|Decimal} value - The rate.
	 * @param {string} symbol - A string that can be parsed as a currency pair.
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

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
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
