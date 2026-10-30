import AssetClass from './../../data/AssetClass.js';
import formatFraction from './../fraction.js';
import formatPrice from './../price.js';

/**
 * The instrument metadata used by the {@link formatForCmdtyView} function.
 *
 * @typedef {Object} PriceFormatProfile
 * @property {{ id: number }|null} [asset] - The instrument's asset class (identified by its numeric id).
 * @property {string} [root] - The root symbol (for futures and options on futures).
 */

const regex = { };

regex.ZB = /^BB\d$/;
regex.ZT = /^BT\d$/;
regex.ZF = /^BF\d$/;
regex.ZN = /^BN\d$/;

/**
 * Applies formatting rules specific to the [cmdtyView](https://www.barchart.com/cmdty/trading/cmdtyview)
 * product.
 *
 * @function
 * @public
 * @param {number} value
 * @param {string} unitCode
 * @param {PriceFormatProfile} profile
 * @returns {string}
 */
export default function formatForCmdtyView(value, unitCode, profile) {
	if (profile.asset?.id === AssetClass.FUTURE_OPTION.id) {
		const root = profile.root;

		// 2021/07/15, BRI. Options for ZB and ZN use unitCode="5" which defines
		// 64 price increments. The default price formatter will output fractions
		// using halves of thirty-seconds (e.g. 0-315). However, the CME specifies
		// formatting with sixty-fourths (e.g. 0-63). These notations are numerically
		// equivalent (i.e. 0-315 equals 0-63); however, customers will expect to see
		// the latter. This logic includes the option "root" symbols for normal, weekly,
		// and wednesday options (for ZB and ZN futures).

		if (root === 'ZB' || root === 'ZN' || regex.ZB.test(root) || regex.ZN.test(root)) {
			return formatFraction(value, 64, 2, '-', false);
		}

		// 2021/07/15, BRI. Options for ZT and ZF use unitCode="6" which defines
		// 128 price increments. The default price formatter will output fractions
		// using quarters of thirty-seconds (e.g. 0-317). However, the CME specifies
		// formatting with halves of sixty-fourths (e.g. 0-635). These notations are
		// numerically equivalent (i.e. 0-317 equals 0-635); however, customers will
		// expect to see the latter. This logic includes the option "root" symbols for
		// normal, weekly,and wednesday options (for ZT and ZF futures).

		if (root === 'ZT' || root === 'ZF' || regex.ZT.test(root) || regex.ZF.test(root)) {
			return formatFraction(value, 640, 3, '-', false);
		}
	}

	return formatPrice(value, unitCode, '-', true, ',');
}
