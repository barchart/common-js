import * as is from '@barchart/common-js/lang/is.js';

import formatDecimal from './decimal.js';
import formatFraction from './fraction.js';
import UnitCode from './../data/UnitCode.js';

/**
 * Converts a numeric price into a human-readable string. One of two modes
 * may be used, depending on the unit code and fraction separator. For example,
 * using unit code "2" the value 9.5432 is formatted as "9.543" in decimal
 * mode and "9-4" in fractional mode.
 *
 * @function
 * @public
 * @param {number} value
 * @param {string} unitCode
 * @param {string=} fractionSeparator - Can be zero or one character in length. If invalid or omitted, a decimal notation is used. If non-decimal, then fractional notation is used (assuming supported by unit code).
 * @param {boolean=} specialFractions - If fractional notation is used, indicates if the "special" factor (i.e. denominator) is used to calculate numerator.
 * @param {string=} thousandsSeparator - Can be zero or one character in length. If invalid or omitted, a zero-length string is used.
 * @param {boolean=} useParenthesis - If true, negative values will be represented with parenthesis (instead of a leading minus sign).
 * @returns {string}
 */
export default function formatPrice(value, unitCode, fractionSeparator, specialFractions, thousandsSeparator, useParenthesis) {
	if (!is.number(value)) {
		return '';
	}

	const unitCodeItem = UnitCode.parse(unitCode);

	if (unitCodeItem === null) {
		return '';
	}

	if (!is.string(fractionSeparator) || fractionSeparator.length > 1) {
		fractionSeparator = '.';
	}

	specialFractions = is.boolean(specialFractions) && specialFractions;
	useParenthesis = is.boolean(useParenthesis) && useParenthesis;

	if (!unitCodeItem.supportsFractions || fractionSeparator === '.') {
		return formatDecimal(value, unitCodeItem.decimalDigits, thousandsSeparator, useParenthesis);
	} else {
		const fractionFactor = unitCodeItem.getFractionFactor(specialFractions);
		const fractionDigits = unitCodeItem.getFractionDigits(specialFractions);

		return formatFraction(value, fractionFactor, fractionDigits, fractionSeparator, useParenthesis);
	}
}
