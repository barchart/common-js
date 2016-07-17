module.exports = (() => {
	'use strict';

	var converters = {
		toDate: function(object) {
			return new Date(object);
		},

		empty: function(object) {
			return object;
		}
	};

	return converters;
})();