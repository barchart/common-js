var assert = require('./assert');

module.exports = function() {
	'use strict';

	var mask = {
		getEmpty: function() {
			return 0;
		},

		add: function(existing, itemToAdd) {
			assert.argumentIsRequired(existing, 'existing', Number);
			assert.argumentIsRequired(itemToAdd, 'itemToAdd', Number);

			if (mask.checkItem(itemToAdd)) {
				return existing | itemToAdd;
			} else {
				return existing;
			}
		},

		remove: function(existing, itemToRemove) {
			assert.argumentIsRequired(existing, 'existing', Number);
			assert.argumentIsRequired(itemToRemove, 'itemToRemove', Number);

			if (mask.checkItem(itemToRemove)) {
				return existing & ~itemToRemove;
			} else {
				return existing;
			}
		},

		has: function(existing, itemToCheck) {
			assert.argumentIsRequired(existing, 'existing', Number);
			assert.argumentIsRequired(itemToCheck, 'itemToCheck', Number);

			return mask.checkItem(itemToCheck) && (existing & itemToCheck) === itemToCheck;
		},

		checkItem: function(itemToCheck) {
			return typeof(itemToCheck) === 'number' && (itemToCheck === 0 || ((itemToCheck & (~itemToCheck + 1)) === itemToCheck));
		}
	};

	return mask;
}();