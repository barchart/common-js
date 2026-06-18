import * as assert from './assert.js';
import * as is from './is.js';

import Decimal from './Decimal.js';
import Currency from './Currency.js';

/**
 * A structure for storing money amounts.
 *
 * @public
 */
export default class Money {
	#decimal;
	#currency;

	/**
	 * @param {Decimal|number|string} value - A amount, which can be parsed as a {@link Decimal}
	 * @param {Currency} currency - The currency.
	 */
	constructor(value, currency) {
		assert.argumentIsRequired(currency, 'currency', Currency, 'Currency');

		this.#decimal = getDecimal(value);
		this.#currency = currency;
	}

	/**
	 * The currency amount.
	 *
	 * @public
	 * @returns {Decimal}
	 */
	get decimal() {
		return this.#decimal;
	}

	/**
	 * The currency.
	 *
	 * @public
	 * @returns {Currency}
	 */
	get currency() {
		return this.#currency;
	}

	/**
	 * @public
	 * @param {*} places
	 * @param {*} mode
	 * @returns {Money}
	 */
	toAmount(places, mode) {
		return new Money(this.#decimal.round(getPlaces(places), mode), this.#currency);
	}

	/**
	 * Returns the JSON representation.
	 *
	 * @public
	 * @returns {object}
	 */
	toJSON() {
		return {
			decimal: this.#decimal,
			currency: this.#currency
		};
	}
	/**
	 * Parses the value emitted by {@link Decimal#toJSON}.
	 *
	 * @public
	 * @static
	 * @param {object} value
	 * @returns {Money}
	 */
	static parse(value) {
		return new Money(value.decimal, value.currency);
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return `[Money]`;
	}
}

function getDecimal(value) {
	if (value instanceof Decimal) {
		return value;
	} else {
		return new Decimal(value);
	}
}

function getPlaces(value) {
	if (is.integer(value) && !(value < 0)) {
		return value;
	} else {
		return 2;
	}
}
