import * as is from '@barchart/common-js/lang/is.js';

import UnitCode from './../data/UnitCode.js';

/**
 * Converts a Barchart "unit" code into a Barchart "base" code. If the "unit"
 * code provided is invalid, a base code of zero will be returned.
 *
 * @function
 * @public
 * @param {string} unitCode
 * @returns {number}
 */
export default function convertUnitCodeToBaseCode(unitCode) {
	if (!is.string(unitCode) || unitCode.length !== 1) {
		return 0;
	}

	const unitCodeItem = UnitCode.parse(unitCode);

	return unitCodeItem === null ? 0 : unitCodeItem.baseCode;
}
