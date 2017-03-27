const assert = require('./../../lang/assert');

module.exports = (() => {
	'use strict';

	return {
		compareDates: (a, b) => {
			assert.argumentIsRequired(a, 'a', Date);
			assert.argumentIsRequired(b, 'b', Date);

			return a - b;
		},

		compareNumbers: (a, b) => {
			assert.argumentIsRequired(a, 'a', Number);
			assert.argumentIsRequired(b, 'b', Number);

			return a - b;
		},

		compareStrings: (a, b) => {
			assert.argumentIsRequired(a, 'a', String);
			assert.argumentIsRequired(b, 'b', String);

			return a.localeCompare(b);
		},

		empty: (a, b) => {
			return 0;
		}
	};
})();