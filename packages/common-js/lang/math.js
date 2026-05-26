const is = require('./is');

module.exports = (() => {
	'use strict';

	return {
		approximate(a, b) {
			if (!is.number(a) || !is.number(b)) {
				return false;
			}

			if (a == b) {
				return true;
			}

			if (isFinite(a) && isFinite(b)) {
				const absoluteDifference = Math.abs(a - b);

				if (absoluteDifference < Number.EPSILON) {
					return true;
				} else {
					return !(absoluteDifference > Math.max(Math.abs(a), Math.abs(b)) * Number.EPSILON);
				}
			} else {
				return false;
			}
		}
	};
})();