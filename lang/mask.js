var assert = require('./assert');

module.exports = (() => {
	'use strict';

	return {
		add(existing, valueToAdd) {
			assert.argumentIsRequired(existing, 'existing', Number);
			assert.argumentIsRequired(valueToAdd, 'valueToAdd', Number);

			return existing | valueToAdd;
		},

		remove(existing, valueToRemove) {
			assert.argumentIsRequired(existing, 'existing', Number);
			assert.argumentIsRequired(valueToRemove, 'valueToRemove', Number);

			return existing & valueToRemove;
		},

		has(existing, candidateValue) {
			assert.argumentIsRequired(existing, 'existing', Number);
			assert.argumentIsRequired(candidateValue, 'candidateValue', Number);

			return (existing & candidateValue) === candidateValue;
		}
	};
})();