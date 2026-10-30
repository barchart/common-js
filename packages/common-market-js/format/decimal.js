import * as is from '@barchart/common-js/lang/is.js';
import { numberToString } from '@barchart/common-js/lang/formatter.js';

/**
 * Formats a number as decimal value (with a given number of digits after the decimal place,
 * thousands separator(s), and options for displaying negative values).
 *
 * @public
 * @param {number} value
 * @param {number} digits
 * @param {string=} thousandsSeparator
 * @param {boolean=} useParenthesis
 * @returns {string}
 */
export default function formatDecimal(value, digits, thousandsSeparator, useParenthesis) {
	if (!is.number(value)) {
		return '';
	}

	if (!is.string(thousandsSeparator) || thousandsSeparator.length > 1) {
		thousandsSeparator = '';
	}

	return numberToString(value, digits, thousandsSeparator, useParenthesis);
}
