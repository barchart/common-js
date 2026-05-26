const assert = require('./assert'),
	is = require('./is');

module.exports = (() => {
	'use strict';

	const mask = {
		getEmpty() {
			return 0;
		},

		add(existing, itemToAdd) {
			assert.argumentIsRequired(existing, 'existing', Number);
			assert.argumentIsRequired(itemToAdd, 'itemToAdd', Number);

			if (mask.checkItem(itemToAdd)) {
				return existing | itemToAdd;
			} else {
				return existing;
			}
		},

		remove(existing, itemToRemove) {
			assert.argumentIsRequired(existing, 'existing', Number);
			assert.argumentIsRequired(itemToRemove, 'itemToRemove', Number);

			if (mask.checkItem(itemToRemove)) {
				return existing & ~itemToRemove;
			} else {
				return existing;
			}
		},

		has(existing, itemToCheck) {
			assert.argumentIsRequired(existing, 'existing', Number);
			assert.argumentIsRequired(itemToCheck, 'itemToCheck', Number);

			return mask.checkItem(itemToCheck) && (existing & itemToCheck) === itemToCheck;
		},

		checkItem(itemToCheck) {
			return is.number(itemToCheck) && (itemToCheck === 0 || ((itemToCheck & (~itemToCheck + 1)) === itemToCheck));
		}
	};

	return mask;
})();
