const assert = require('./assert'),
	Enum = require('./Enum'),
	is = require('./is');

module.exports = (() => {
	'use strict';

	/**
	 * An enumeration for currency types.
	 *
	 * @public
	 * @param {String} code - Currency code (e.g. "USD")
	 * @param {String} description - The description (e.g. "US Dollar")
	 * @param {Number} precision - The number of decimal places possible for by a real world transaction.
	 * @extends {Enum}
	 */
	class Currency extends Enum {
		constructor(code, description, precision, alternateDescription) {
			super(code, description);

			assert.argumentIsRequired(precision, 'precision', Number);
			assert.argumentIsValid(precision, 'precision', is.integer, 'is an integer');

			assert.argumentIsOptional(alternateDescription, 'alternateDescription', String);

			this._precision = precision;

			this._alternateDescription = alternateDescription || description;
		}

		/**
		 * The maximum number of decimal places supported by a real world transaction.
		 *
		 * @public
		 * @returns {Number}
		 */
		get precision() {
			return this._precision;
		}

		/**
		 * An alternate human-readable description.
		 *
		 * @public
		 * @returns {String}
		 */
		get alternateDescription() {
			return this._alternateDescription;
		}

		/**
		 * Given a code, returns the enumeration item.
		 *
		 * @public
		 * @static
		 * @param {String} code
		 * @returns {Currency|null}
		 */
		static parse(code) {
			return Enum.fromCode(Currency, code);
		}

		/**
		 * The Australian Dollar.
		 *
		 * @public
		 * @static
		 * @returns {Currency}
		 */
		static get AUD() {
			return aud;
		}

		/**
		 * The Canadian Dollar.
		 *
		 * @public
		 * @static
		 * @returns {Currency}
		 */
		static get CAD() {
			return cad;
		}

		/**
		 * The Euro.
		 *
		 * @public
		 * @static
		 * @returns {Currency}
		 */
		static get EUR() {
			return eur;
		}

		/**
		 * The British Pound.
		 *
		 * @public
		 * @static
		 * @returns {Currency}
		 */
		static get GBP() {
			return gbp;
		}

		/**
		 * The British Penny.
		 *
		 * @public
		 * @static
		 * @returns {Currency}
		 */
		static get GBX() {
			return gbx;
		}

		/**
		 * The Hong Kong Dollar.
		 *
		 * @public
		 * @static
		 * @returns {Currency}
		 */
		static get HKD() {
			return hkd;
		}

		/**
		 * The Japanese Yen.
		 *
		 * @public
		 * @static
		 * @returns {Currency}
		 */
		static get JPY() {
			return jpy;
		}

		/**
		 * The US Dollar.
		 *
		 * @public
		 * @static
		 * @returns {Currency}
		 */
		static get USD() {
			return usd;
		}

		toString() {
			return `[Currency (code=${this.code})]`;
		}
	}

	const aud = new Currency('AUD', 'Australian Dollar', 2, 'AUD$');
	const cad = new Currency('CAD', 'Canadian Dollar', 2, 'CAD$');
	const eur = new Currency('EUR', 'Euro', 2, 'EUR');
	const gbp = new Currency('GBP', 'British Pound', 2, 'GBP');
	const gbx = new Currency('GBX', 'British Penny', 2, 'GBX');
	const hkd = new Currency('HKD', 'Hong Kong Dollar', 2, 'HK$');
	const jpy = new Currency('JPY', 'Japanese Yen', 2, 'JPY');
	const usd = new Currency('USD', 'US Dollar', 2, 'US$');

	return Currency;
})();
