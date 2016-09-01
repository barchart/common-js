module.exports = (() => {
	'use strict';

	return {
		toDate(object) {
			return new Date(object);
		},

		empty(object) {
			return object;
		}
	};
})();