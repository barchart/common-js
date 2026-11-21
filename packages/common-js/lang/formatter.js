import * as is from './is.js';

const FOUR_INTEGER_DIGITS = /^-?\d{4}/;

/**
 * Formats a number into a string for display purposes.
 *
 * @function
 * @public
 * @param {number|null|undefined} value
 * @param {number} digits
 * @param {string=} thousandsSeparator
 * @param {boolean=} useParenthesis
 */
export function numberToString(value, digits, thousandsSeparator, useParenthesis) {
	if (!is.number(value)) {
		return '';
	}

	const applyParenthesis = value < 0 && useParenthesis === true;

	if (applyParenthesis) {
		value = 0 - value;
	}

	let fixed = value.toFixed(digits);

	if (thousandsSeparator && FOUR_INTEGER_DIGITS.test(fixed)) {
		const start = fixed.charCodeAt(0) === 45 ? 1 : 0;
		const dot = fixed.indexOf('.', start);
		const end = dot === -1 ? fixed.length : dot;

		let i = start + ((end - start) % 3 || 3);
		let grouped = fixed.slice(0, i);

		while (i < end) {
			grouped += thousandsSeparator + fixed.slice(i, i + 3);

			i += 3;
		}

		fixed = grouped + fixed.slice(end);
	}

	if (applyParenthesis) {
		return `(${fixed})`;
	}

	return fixed;
}