import * as assert from './assert.js';
import * as is from './is.js';

import Enum from './Enum.js';

/**
 * An enumeration for currency types.
 *
 * @public
 * @extends {Enum}
 */
export default class Currency extends Enum {
	#precision;
	#alternateDescription;

	/**
	 * @param {string} code - Currency code (e.g. "USD")
	 * @param {string} description - The description (e.g. "US Dollar")
	 * @param {number} precision - The number of decimal places possible for by a real world transaction.
	 */
	constructor(code, description, precision, alternateDescription) {
		super(code, description);

		assert.argumentIsRequired(precision, 'precision', Number);
		assert.argumentIsValid(precision, 'precision', is.integer, 'is an integer');

		assert.argumentIsOptional(alternateDescription, 'alternateDescription', String);

		this.#precision = precision;

		this.#alternateDescription = alternateDescription || description;
	}

	/**
	 * The maximum number of decimal places supported by a real world transaction.
	 *
	 * @public
	 * @returns {number}
	 */
	get precision() {
		return this.#precision;
	}

	/**
	 * An alternate human-readable description.
	 *
	 * @public
	 * @returns {string}
	 */
	get alternateDescription() {
		return this.#alternateDescription;
	}

	/**
	 * Given a code, returns the enumeration item.
	 *
	 * @public
	 * @static
	 * @param {string} code
	 * @returns {Currency|null}
	 */
	static parse(code) {
		const value = Enum.fromCode(Currency, code);

		return value instanceof Currency ? value : null;
	}
	
	/**
	 * The Argentine Peso.
	 *
	 * @public
	 * @static
	 * @returns {Currency}
	 */
	static get ARS() {
		return ars;
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
	 * The Bermudian Dollar.
	 *
	 * @public
	 * @static
	 * @returns {Currency}
	 */
	static get BMD() {
		return bmd;
	}

	/**
	 * The Brazilian Real.
	 *
	 * @public
	 * @static
	 * @returns {Currency}
	 */
	static get BRL() {
		return brl;
	}

	/**
	 * The Bahamian Dollar.
	 *
	 * @public
	 * @static
	 * @returns {Currency}
	 */
	static get BSD() {
		return bsd;
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
	 * The Swiss Franc.
	 *
	 * @public
	 * @static
	 * @returns {Currency}
	 */
	static get CHF() {
		return chf;
	}

	/**
	 * The Chinese Yuan.
	 *
	 * @public
	 * @static
	 * @returns {Currency}
	 */
	static get CNY() {
		return cny;
	}

	/**
	 * The Czech Koruna.
	 *
	 * @public
	 * @static
	 * @returns {Currency}
	 */
	static get CZK() {
		return czk;
	}

	/**
	 * The Danish Krone.
	 *
	 * @public
	 * @static
	 * @returns {Currency}
	 */
	static get DKK() {
		return dkk;
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
	 * The Fijian Dollar.
	 *
	 * @public
	 * @static
	 * @returns {Currency}
	 */
	static get FJD() {
		return fjd;
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
	 * The Ghanaian Cedi.
	 *
	 * @public
	 * @static
	 * @returns {Currency}
	 */
	static get GHS() {
		return ghs;
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
	 * The Hungarian Forint.
	 *
	 * @public
	 * @static
	 * @returns {Currency}
	 */
	static get HUF() {
		return huf;
	}

	/**
	 * The Indonesian Rupiah.
	 *
	 * @public
	 * @static
	 * @returns {Currency}
	 */
	static get IDR() {
		return idr;
	}

	/**
	 * The Israeli New Shekel.
	 *
	 * @public
	 * @static
	 * @returns {Currency}
	 */
	static get ILS() {
		return ils;
	}

	/**
	 * The Jordanian Dinar.
	 *
	 * @public
	 * @static
	 * @returns {Currency}
	 */
	static get JOD() {
		return jod;
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
	 * The South Korean Won.
	 *
	 * @public
	 * @static
	 * @returns {Currency}
	 */
	static get KRW() {
		return krw;
	}

	/**
	 * The Lebanese Pound.
	 *
	 * @public
	 * @static
	 * @returns {Currency}
	 */
	static get LBP() {
		return lbp;
	}

	/**
	 * The Mexican Peso.
	 *
	 * @public
	 * @static
	 * @returns {Currency}
	 */
	static get MXN() {
		return mxn;
	}

	/**
	 * The Malaysian Ringgit.
	 *
	 * @public
	 * @static
	 * @returns {Currency}
	 */
	static get MYR() {
		return myr;
	}

	/**
	 * The Namibian Dollar.
	 *
	 * @public
	 * @static
	 * @returns {Currency}
	 */
	static get NAD() {
		return nad;
	}

	/**
	 * The Nigerian Naira.
	 *
	 * @public
	 * @static
	 * @returns {Currency}
	 */
	static get NGN() {
		return ngn;
	}

	/**
	 * The Norwegian Krone.
	 *
	 * @public
	 * @static
	 * @returns {Currency}
	 */
	static get NOK() {
		return nok;
	}

	/**
	 * The New Zealand Dollar.
	 *
	 * @public
	 * @static
	 * @returns {Currency}
	 */
	static get NZD() {
		return nzd;
	}

	/**
	 * The Peruvian Sol.
	 *
	 * @public
	 * @static
	 * @returns {Currency}
	 */
	static get PEN() {
		return pen;
	}

	/**
	 * The Papua New Guinean Kina.
	 *
	 * @public
	 * @static
	 * @returns {Currency}
	 */
	static get PGK() {
		return pgk;
	}

	/**
	 * The Philippine peso.
	 *
	 * @public
	 * @static
	 * @returns {Currency}
	 */
	static get PHP() {
		return php;
	}

	/**
	 * The Polish Zloty.
	 *
	 * @public
	 * @static
	 * @returns {Currency}
	 */
	static get PLN() {
		return pln;
	}

	/**
	 * The Russian Ruble.
	 *
	 * @public
	 * @static
	 * @returns {Currency}
	 */
	static get RUB() {
		return rub;
	}

	/**
	 * The Russian Ruble (Old).
	 *
	 * @public
	 * @static
	 * @returns {Currency}
	 */
	static get RUR() {
		return rur;
	}

	/**
	 * The Swedish Krona.
	 *
	 * @public
	 * @static
	 * @returns {Currency}
	 */
	static get SEK() {
		return sek;
	}

	/**
	 * The Singapore Dollar.
	 *
	 * @public
	 * @static
	 * @returns {Currency}
	 */
	static get SGD() {
		return sgd;
	}

	/**
	 * The Thai Baht.
	 *
	 * @public
	 * @static
	 * @returns {Currency}
	 */
	static get THB() {
		return thb;
	}

	/**
	 * The Turkish Lira.
	 *
	 * @public
	 * @static
	 * @returns {Currency}
	 */
	static get TRY() {
		return trx;
	}

	/**
	 * The New Taiwan Dollar.
	 *
	 * @public
	 * @static
	 * @returns {Currency}
	 */
	static get TWD() {
		return twd;
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

	/**
	 * The Uruguay Peso.
	 *
	 * @public
	 * @static
	 * @returns {Currency}
	 */
	static get UYI() {
		return uyi;
	}

	/**
	 * The South African Rand.
	 *
	 * @public
	 * @static
	 * @returns {Currency}
	 */
	static get ZAR() {
		return zar;
	}

	/**
	 * The Zambian Kwacha.
	 *
	 * @public
	 * @static
	 * @returns {Currency}
	 */
	static get ZMW() {
		return zmw;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return `[Currency (code=${this.code})]`;
	}
}

const ars = new Currency('ARS', 'Argentine Peso', 2, 'ARS');
const aud = new Currency('AUD', 'Australian Dollar', 2, 'AUD$');
const bmd = new Currency('BMD', 'Bermudian Dollar', 2, 'BMD');
const brl = new Currency('BRL', 'Brazilian Real', 2, 'BRL');
const bsd = new Currency('BSD', 'Bahamian Dollar', 2, 'BSD');
const cad = new Currency('CAD', 'Canadian Dollar', 2, 'CAD$');
const chf = new Currency('CHF', 'Swiss Franc', 2, 'CHF');
const cny = new Currency('CNY', 'Chinese Yuan', 2, 'CNY');
const czk = new Currency('CZK', 'Czech Koruna', 2, 'CZK');
const dkk = new Currency('DKK', 'Danish Krone', 2, 'DKK');
const eur = new Currency('EUR', 'Euro', 2, 'EUR');
const fjd = new Currency('FJD', 'Fijian Dollar', 2, 'FJD');
const gbp = new Currency('GBP', 'British Pound', 2, 'GBP');
const gbx = new Currency('GBX', 'British Penny', 2, 'GBX');
const ghs = new Currency('GHS', 'Ghanaian Cedi', 2, 'GHS');
const hkd = new Currency('HKD', 'Hong Kong Dollar', 2, 'HK$');
const huf = new Currency('HUF', 'Hungarian Forint', 2, 'HUF');
const idr = new Currency('IDR', 'Indonesian Rupiah', 2, 'IDR');
const ils = new Currency('ILS', 'Israeli New Shekel', 2, 'ILS');
const jod = new Currency('JOD', 'Jordanian Dinar', 2, 'JOD');
const jpy = new Currency('JPY', 'Japanese Yen', 2, 'JPY');
const krw = new Currency('KRW', 'South Korean Won', 2, 'KRW');
const lbp = new Currency('LBP', 'Lebanese Pound', 2, 'LBP');
const mxn = new Currency('MXN', 'Mexican Peso', 2, 'MXN');
const myr = new Currency('MYR', 'Malaysian Ringgit', 2, 'MYR');
const nad = new Currency('NAD', 'Namibian Dollar', 2, 'NAD');
const ngn = new Currency('NGN', 'Nigerian Naira', 2, 'NGN');
const nok = new Currency('NOK', 'Norwegian Krone', 2, 'Nkr');
const nzd = new Currency('NZD', 'New Zealand Dollar', 2, 'NZD');
const pen = new Currency('PEN', 'Peruvian Sol', 2, 'PEN');
const pgk = new Currency('PGK', 'Papua New Guinean Kina', 2, 'PGK');
const php = new Currency('PHP', 'Philippine peso', 2, 'PHP');
const pln = new Currency('PLN', 'Polish Zloty', 2, 'PLN');
const rub = new Currency('RUB', 'Russian Ruble', 2, 'RUB');
const rur = new Currency('RUR', 'Russian Ruble (Old)', 2, 'RUR');
const sek = new Currency('SEK', 'Swedish Krona', 2, 'SEK');
const sgd = new Currency('SGD', 'Singapore Dollar', 2, 'SGD');
const thb = new Currency('THB', 'Thai Baht', 2, 'THB');
const trx = new Currency('TRY', 'Turkish Lira', 2, 'TRY');
const twd = new Currency('TWD', 'New Taiwan Dollar', 2, 'TWD');
const usd = new Currency('USD', 'US Dollar', 2, 'US$');
const uyi = new Currency('UYI', 'Uruguay Peso', 2, 'UYI');
const zar = new Currency('ZAR', 'South African Rand', 2, 'ZAR');
const zmw = new Currency('ZMW', 'Zambian Kwacha', 2, 'ZMW');
