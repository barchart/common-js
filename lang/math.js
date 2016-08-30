var _ = require('lodash');

module.exports = function() {
	'use strict';

	var epsilon = Number.EPSILON || 2.2204460492503130808472633361816E-16;

	var math = {
		approximate: function(a, b) {
			if (!_.isNumber(a) || !_.isNumber(b)) {
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

	return math;
}();