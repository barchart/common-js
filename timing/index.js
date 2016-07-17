var RateLimiter = require('./RateLimiter');
var Scheduler = require('./Scheduler');

module.exports = (() => {
	'use strict';

	return {
		RateLimiter: RateLimiter,
		Scheduler: Scheduler
	};
})();