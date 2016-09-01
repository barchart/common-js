module.exports = (() => {
	'use strict';

	var converters = {
		toDate(object) {
			return new Date(object);
		},

		empty(object) {
			return object;
		}
	};

	return converters;
})();