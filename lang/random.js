const assert = require('./assert'),
	is = require('./is');

module.exports = (() => {
	'use strict';

	return {
		range(minimum, maximum) {
			assert.argumentIsRequired(minimum, 'minimum', Number);
			assert.argumentIsRequired(maximum, 'maximum', Number);

			const mn = Math.trunc(minimum);
			const mx = Math.trunc(maximum);

			return Math.min(mn, mx) + Math.floor(Math.random() * Math.abs(mx - mn));
		}
	};
})();