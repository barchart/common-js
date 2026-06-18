import * as is from './is.js';

/**
* Utilities checking HTTP connections.
*
* @public
* @module lang/connection
* @deprecated
*/

/**
 * Returns true, if the input is a true boolean value; otherwise false.
 *
 * @param {boolean=} secure
 * @returns {boolean}
 */
export function getIsSecure(secure) {
	return is.boolean(secure) && secure;
}
