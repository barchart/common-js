const RateLimiter = require('./RateLimiter'),
	Serializer = require('./Serializer'),
	Scheduler = require('./Scheduler'),
	WindowCounter = require('./WindowCounter');

module.exports = (() => {
	'use strict';

	return {
		RateLimiter: RateLimiter,
		Serializer: Serializer,
		Scheduler: Scheduler,
		WindowCounter: WindowCounter
	};
})();