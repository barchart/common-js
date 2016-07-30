var assert = require('./assert');

module.exports = (() => {
	'use strict';

	return {
		unique(a) {
			assert.argumentIsArray(a, 'a');

			return a.filter((item, index, array) => {
				return array.indexOf(item) === index;
			});
		}
	};
})();