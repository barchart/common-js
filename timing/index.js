var RateLimiter = require('./RateLimiter');
var Scheduler = require('./Scheduler');

module.exports = function() {
	'use strict';

	return {
		RateLimiter: RateLimiter,
		Scheduler: Scheduler
	};
}();