var is = require('./is');

module.exports = (() => {
	'use strict';

	var epsilon = Number.EPSILON;

	return {
		approximate(a, b) {
			if (!is.number(a) || is.number(b)) {
				return false;
			}

			if (a == b) {
				return true;
			}

			if (isFinite(a) && isFinite(b)) {
				var absoluteDifference = Math.abs(a - b);

				if (absoluteDifference < epsilon) {
					return true;
				} else {
					return !(absoluteDifference > Math.max(Math.abs(a), Math.abs(b)) * epsilon);
				}
			} else {
				return false;
			}
		}
	};
})();