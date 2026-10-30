import * as assert from '@barchart/common-js/lang/assert.js';
import * as is from '@barchart/common-js/lang/is.js';

import Decimal from '@barchart/common-js/lang/Decimal.js';
import Enum from '@barchart/common-js/lang/Enum.js';

// 2021/07/14, For more detail on the "special" fractional formatting (i.e. CME
// tick notation), please refer to the detailed unit test suite written for CME
// notation (see the cmeSpec.js file).

/**
 * An enumeration that describes different conventions for formatting prices,
 * as decimals or fractions (using tick notation). Each instrument is assigned
 * a unit code. The unit code determines the display convention.
 *
 * Barchart uses fourteen distinct unit codes.
 *
 * @public
 * @extends {Enum}
 */
export default class UnitCode extends Enum {
	#baseCode;
	#decimalDigits;
	#supportsFractions;
	#fractionFactor;
	#fractionDigits;
	#fractionFactorSpecial;
	#fractionDigitsSpecial;

	/**
	 * @param {string} code
	 * @param {number} baseCode
	 * @param {number} decimalDigits - When formatting a price as a decimal value, the number of decimal places to display.
	 * @param {boolean} supportsFractions - As an alternative to decimal-formatted prices, some instruments support fractional representations.
	 * @param {number=} fractionFactor - The count of discrete prices which a unit can be divided into (e.g. a US dollar can be divided into 100 cents). By default, this is also the implied denominator in fractional notation (e.g. 3.6875 equals 3 and 22/32 — which is represented in fractional notation as "3-22", where the denominator of 32 is implied).
	 * @param {number=} fractionDigits - The number of digits of the fraction's numerator to display (e.g. using two digits, the fraction 22/32 is shown as "0-22"; using three digits, the fraction 22.375/32 is shown as "0-223").
	 * @param {number=} fractionFactorSpecial - Special fraction factors refer to the CME tick notation scheme (read more [here](https://www.cmegroup.com/confluence/display/EPICSANDBOX/Fractional+Pricing+-+Tick+and+Decimal+Conversions)). For example, the CME notation for 0.51171875 (in 1/8ths of 1/32nds) is "0-163", where the numerator of "163" means 16 thirty-seconds and 3 eighths of a thirty-second, where the actual fraction is 16.3[75] / 32, which equals 0.51171875.
	 * @param {number=} fractionDigitsSpecial - The number of digits of the fraction's numerator to display, when formatting in CME tick notation. For example, the notation "0-163" (in 1/8ths of 1/32nds) equates to the fraction of 16.375/32. This notation is limited to three digits (163) and omits the trailing two digits (75).
	 */
	constructor(code, baseCode, decimalDigits, supportsFractions, fractionFactor, fractionDigits, fractionFactorSpecial, fractionDigitsSpecial) {
		super(code, code);

		this.#baseCode = baseCode;

		this.#decimalDigits = decimalDigits;

		this.#supportsFractions = supportsFractions;

		if (supportsFractions) {
			this.#fractionFactor = fractionFactor;
			this.#fractionDigits = fractionDigits;

			this.#fractionFactorSpecial = fractionFactorSpecial || fractionFactor;
			this.#fractionDigitsSpecial = fractionDigitsSpecial || fractionDigits;
		} else {
			this.#fractionFactor = undefined;
			this.#fractionDigits = undefined;

			this.#fractionFactorSpecial = undefined;
			this.#fractionDigitsSpecial = undefined;
		}
	}

	/**
	 * The numeric counterpart of a "unit" code.
	 *
	 * @public
	 * @returns {number}
	 */
	get baseCode() {
		return this.#baseCode;
	}

	/**
	 * The single character "unit" code.
	 *
	 * @public
	 * @returns {string}
	 */
	get unitCode() {
		return this.code;
	}

	/**
	 * When formatting in decimal mode, the number of digits to show after the
	 * decimal point.
	 *
	 * @public
	 * @returns {number}
	 */
	get decimalDigits() {
		return this.#decimalDigits;
	}

	/**
	 * Indicates if formatting can use the alternative to decimal notation -- that
	 * is, fractional notation.
	 *
	 * @public
	 * @returns {boolean}
	 */
	get supportsFractions() {
		return this.#supportsFractions;
	}

	/**
	 * The count of discrete prices which a unit can be divided into (e.g. a US dollar can be divided
	 * into 100 cents). By default, this is also the implied denominator in fractional notation (e.g. 3.6875
	 * equals 3 and 22/32 — which is represented in fractional notation as "3-22", where the denominator of 32
	 * is implied).
	 *
	 * @public
	 * @returns {number|undefined}
	 */
	get fractionFactor() {
		return this.#fractionFactor;
	}

	/**
	 * The number of digits of the fraction's numerator to display (e.g. using two digits, the fraction 22/32 is
	 * shown as "0-22"; using three digits, the fraction 22.375/32 is shown as "0-223").
	 *
	 * @public
	 * @returns {number|undefined}
	 */
	get fractionDigits() {
		return this.#fractionDigits;
	}

	/**
	 * Special fraction factors refer to the CME tick notation scheme (read more [here](https://www.cmegroup.com/confluence/display/EPICSANDBOX/Fractional+Pricing+-+Tick+and+Decimal+Conversions)).
	 *
	 * @public
	 * @returns {number|undefined}
	 */
	get fractionFactorSpecial() {
		return this.#fractionFactorSpecial;
	}

	/**
	 * Same as {@link UnitCode#fractionDigits} for "special" fractions.
	 *
	 * @public
	 * @returns {number|undefined}
	 */
	get fractionDigitsSpecial() {
		return this.#fractionDigitsSpecial;
	}

	/**
	 * The number of digits of the fraction's numerator to display, when formatting
	 * in CME tick notation. For example, the notation "0-163" (in 1/8ths of 1/32nds) equates
	 * to the fraction of 16.375/32. This notation is limited to three digits (163)
	 * and omits the trailing two digits (75).
	 *
	 * @public
	 * @param {boolean=} special
	 * @returns {number|undefined}
	 */
	getFractionFactor(special) {
		return special === true ? this.#fractionFactorSpecial : this.#fractionFactor;
	}

	/**
	 * Returns the {@link UnitCode#fractionDigits} or {@link UnitCode#fractionDigitsSpecial} value.
	 *
	 * @public
	 * @param {boolean=} special
	 * @returns {number|undefined}
	 */
	getFractionDigits(special) {
		return special === true ? this.#fractionDigitsSpecial : this.#fractionDigits;
	}

	/**
	 * Determines the minimum price fluctuation. In other words, multiples
	 * of this value determine the set of valid quote and trade prices
	 * for an instrument.
	 *
	 * @public
	 * @param {number} tickIncrement - The instrument tick increment.
	 * @returns {number}
	 */
	getMinimumTick(tickIncrement) {
		assert.argumentIsValid(tickIncrement, 'tickIncrement', is.integer, 'must be an integer');

		const one = new Decimal(1);
		const ten = new Decimal(10);

		let discretePrice;

		if (this.supportsFractions) {
			discretePrice = one.divide(this.#fractionFactor);
		} else {
			discretePrice = one.divide(ten.raise(this.#decimalDigits));
		}

		const minimumTick = discretePrice.multiply(tickIncrement);

		return minimumTick.toFloat();
	}

	/**
	 * Returns the change in value of a position when the instrument's price moves
	 * up by the minimum tick.
	 *
	 * @public
	 * @param {number} tickIncrement - The instrument tick increment.
	 * @param {number} pointValue - The value of a one-point price change.
	 * @returns {number}
	 */
	getMinimumTickValue(tickIncrement, pointValue) {
		assert.argumentIsValid(tickIncrement, 'tickIncrement', is.integer, 'must be an integer');
		assert.argumentIsValid(pointValue, 'pointValue', is.number, 'must be a number');

		const minimumTick = new Decimal(this.getMinimumTick(tickIncrement));
		const minimumTickValue = minimumTick.multiply(pointValue);

		return minimumTickValue.toFloat();
	}

	/**
	 * Rounds a value to the nearest valid tick.
	 *
	 * @param {number|Decimal} value - The price to round.
	 * @param {number|Decimal} minimumTick - The minimum tick size (see {@link UnitCode#getMinimumTick})
	 * @param {boolean=} roundToZero - When true, the rounding will always go towards zero.
	 * @returns {number}
	 */
	roundToNearestTick(value, minimumTick, roundToZero) {
		assert.argumentIsValid(value, 'value', x => is.number(x) || x instanceof Decimal, 'must be a number primitive or a Decimal instance');
		assert.argumentIsValid(minimumTick, 'minimumTick', x => is.number(x) || x instanceof Decimal, 'must be a number primitive or a Decimal instance');
		assert.argumentIsOptional(roundToZero, 'roundToZero', Boolean);

		let valueToUse;

		if (value instanceof Decimal) {
			valueToUse = value;
		} else {
			valueToUse = new Decimal(value);
		}

		let ticks = valueToUse.divide(minimumTick);
		let remainder = valueToUse.mod(minimumTick);

		if (!remainder.getIsZero()) {
			ticks = ticks.round(0, is.boolean(roundToZero) && roundToZero ? Decimal.ROUNDING_MODE.DOWN : Decimal.ROUNDING_MODE.NORMAL);
		}

		return ticks.multiply(minimumTick).toFloat();
	}

	/**
	 * @returns {string}
	 */
	toString() {
		return `[UnitCode (code=${this.code})]`;
	}

	/**
	 * Converts a unit code character into a {@link UnitCode} enumeration item.
	 *
	 * @public
	 * @static
	 * @param {string} code
	 * @returns {UnitCode|null}
	 */
	static parse(code) {
		return Enum.fromCode(UnitCode, code);
	}

	/**
	 * Converts a numeric "base" code into a {@link UnitCode} item.
	 *
	 * @public
	 * @static
	 * @param {number} code
	 * @returns {UnitCode|null}
	 */
	static fromBaseCode(code) {
		return Enum.getItems(UnitCode).find(x => x.baseCode === code) || null;
	}
}

const TWO = new UnitCode('2', -1, 3, true, 8, 1);
const THREE = new UnitCode('3', -2, 4, true, 16, 2);
const FOUR = new UnitCode('4', -3, 5, true, 32, 2);
const FIVE = new UnitCode('5', -4, 6, true, 64, 2, 320, 3);
const SIX = new UnitCode('6', -5, 7, true, 128, 3, 320, 3);
const SEVEN = new UnitCode('7', -6, 8, true, 256, 3, 320, 3);

const EIGHT = new UnitCode('8', 0, 0, false);
const NINE = new UnitCode('9', 1, 1, false);

const A = new UnitCode('A', 2, 2, false);
const B = new UnitCode('B', 3, 3, false);
const C = new UnitCode('C', 4, 4, false);
const D = new UnitCode('D', 5, 5, false);
const E = new UnitCode('E', 6, 6, false);
const F = new UnitCode('F', 7, 7, false);
