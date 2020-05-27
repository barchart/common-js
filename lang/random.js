const assert = require('./assert');

module.exports = (() => {
	'use strict';

	return {
		/**
		 * Returns a random integer within a given range.
		 *
		 * @public
		 * @param {Number} minimum - The minimum value (inclusive).
		 * @param {Number} maximum - The maximum value (exclusive).
		 * @returns {Number}
		 */
		range(minimum, maximum) {
			assert.argumentIsRequired(minimum, 'minimum', Number);
			assert.argumentIsRequired(maximum, 'maximum', Number);

			const mn = Math.trunc(minimum);
			const mx = Math.trunc(maximum);

			return Math.min(mn, mx) + Math.floor(Math.random() * Math.abs(mx - mn));
		}
	};
})();