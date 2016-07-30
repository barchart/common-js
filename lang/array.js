var assert = require('./assert');

module.exports = (() => {
	'use strict';

	return {
		unique(a) {
			assert.argumentIsArray(a, 'a');

			return a.filter((item, index, array) => {
				return array.indexOf(item) === index;
			});
		},

		groupBy(a, keySelector) {
			assert.argumentIsArray(a, 'a');
			assert.argumentIsRequired(keySelector, 'keySelector', Function);

			return a.reduce((groups, item) => {
				const key = keySelector(item);

				if (!groups.hasOwnProperty(key)) {
					groups[key] = [ ];
				}

				groups[key].push(item);

				return groups;
			}, { });
		},

		indexBy(a, keySelector) {
			assert.argumentIsArray(a, 'a');
			assert.argumentIsRequired(keySelector, 'keySelector', Function);

			return a.reduce((map, item) => {
				const key = keySelector(item);

				if (map.hasOwnProperty(key)) {
					throw new Error('Unable to index array. A duplicate key exists.');
				}

				map[key] = item;

				return map;
			}, { });
		}
	};
})();