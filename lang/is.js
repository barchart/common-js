module.exports = (() => {
	'use strict';

	return {
		number(candidate) {
			return typeof(candidate) === 'number';
		},

		string(candidate) {
			return typeof(candidate) === 'string';
		},

		date(candidate) {
			return candidate instanceof Date;
		},

		fn(candidate) {
			return typeof(candidate) === 'function';
		},

		array(candidate) {
			return Array.isArray(candidate);
		},

		boolean(candidate) {
			return typeof(candidate) === 'boolean';
		}
	};
})();