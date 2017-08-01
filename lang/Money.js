const assert = require('./assert'),
	is = require('./is');

const Decimal = require('./Decimal');

module.exports = (() => {
	'use strict';

	class Money {
		constructor(value, currency) {
			assert.argumentIsRequired(currency, 'currency', String);

			this._decimal = getDecimal(value);
			this._currency = currency;
		}

		get decimal() {
			return this._decimal;
		}

		get currency() {
			return this._currency;
		}

		toAmount(places, mode) {
			return new Money(this._decimal.round(getPlaces(places), mode), this._currency);
		}

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

	return Money;
})();
