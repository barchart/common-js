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
	 * @extends {Enum}
	 */
	class Currency extends Enum {
		constructor(code, description) {
			super(code, description);
		}

		/**
		 * The Canadian Dollar.
		 *
		 * @returns {Currency}
		 */
		static get CAD() {
			return cad;
		}

		/**
		 * The Euro.
		 *
		 * @returns {Currency}
		 */
		static EUR() {
			return eur;
		}

		/**
		 * The US Dollar.
		 *
		 * @returns {Currency}
		 */
		static get USD() {
			return usd;
		}

		toString() {
			return `[Currency (code=${this.code})]`;
		}
	}

	const cad = new Currency('CAD', 'Canadian Dollar');
	const eur = new Currency('EUR', 'Euro');
	const usd = new Currency('USD', 'US Dollar');

	return Currency;
})();
