const is = require('./is');

module.exports = (() => {
	'use strict';

	/**
	 * Utilities checking HTTP connections.
	 *
	 * @public
	 * @module lang/connection
	 * @deprecated
	 */
	return  {
		/**
		 * Returns true, if the input is a true boolean value; otherwise false.
		 *
		 * @param {Boolean=} secure
		 * @returns {Boolean}
		 */
		getIsSecure(secure) {
			return is.boolean(secure) && secure;
		}
	};
})();