var RateLimiter = require('./../../../timing/RateLimiter');

describe('When a RateLimiter is constructed (1 execution per 25 milliseconds)', function() {
	'use strict';

	var limiter;

	var windowMaximumCount;
	var windowDurationMilliseconds;
	var concurrency;

	beforeEach(function() {
		limiter = new RateLimiter(windowMaximumCount = 1, windowDurationMilliseconds = 25, concurrency = null);
	});

	describe('and tasks are scheduled', function() {
		var spies;
		var promises;

		var start;

		beforeEach(function() {
			start = new Date();

			spies = [ ];
			promises = [ ];

			for (var i = 0; i < 10; i++) {
				 var spy = jasmine.createSpy('spy');

				spies.push(spy);

				promises.push(limiter.enqueue(spy));
			}
		});

		it('the tasks should serialized', function(done) {
			var promise = null;

			var getValidatedPromise = function(promise, index) {
				return promise.then(function() {
					for (var i = 0; i < spies.length; i++) {
						var count;

						if (i > index) {
							count = 0;
						} else {
							count = 1;
						}

						expect(spies[i].calls.count()).toEqual(count);
					}
				});
			};

			for (var i = 0; i < promises.length; i++) {
				var p = getValidatedPromise(promises[i], i);

				if (promise === null) {
					promise = p;
				} else {
					promise = promise.then(function() {
						return p;
					});
				}
			}

			promise
				.then(function() {
					done();
				});
		});

		it('the tasks not finish before the earliest possible moment', function(done) {
			var promise = null;

			var getValidatedPromise = function(promise, index) {
				return promise.then(function() {
					var end = new Date();
					var duration = end.getTime() - start.getTime();

					var shortestPossibleDuration = Math.floor(index / windowMaximumCount) * windowDurationMilliseconds;

					expect(duration + 1).not.toBeLessThan(shortestPossibleDuration);
				});
			};

			for (var i = 0; i < promises.length; i++) {
				var p = getValidatedPromise(promises[i], i);

				if (promise === null) {
					promise = p;
				} else {
					promise = promise.then(function() {
						return p;
					});
				}
			}

			promise
				.then(function() {
					done();
				});
		});
	});

	describe('and failing tasks are scheduled', function() {
		var spies;
		var promises;
		var error;

		var start;

		beforeEach(function() {
			start = new Date();

			spies = [ ];
			promises = [ ];

			error = new Error('oops');

			for (var i = 0; i < 2; i++) {
				var spy = jasmine.createSpy('spy').and.callFake(function() {
					throw error;
				});

				spies.push(spy);

				promises.push(limiter.enqueue(spy));
			}
		});

		it('each task should be executed', function(done) {
			var promise = null;

			var getValidatedPromise = function(promise, index) {
				return promise.catch(function(error) {
					var end = new Date();
					var duration = end.getTime() - start.getTime();

					var shortestPossibleDuration = Math.floor(index / windowMaximumCount) * windowDurationMilliseconds;

					expect(duration + 1).not.toBeLessThan(shortestPossibleDuration);
					expect(error).toBe(error);
				});
			};

			for (var i = 0; i < promises.length; i++) {
				var p = getValidatedPromise(promises[i], i);

				if (promise === null) {
					promise = p;
				} else {
					promise = promise.then(function() {
						return p;
					});
				}
			}

			promise
				.then(function() {
					done();
				});
		});
	});
});

describe('When a RateLimiter is constructed (2 execution per 25 milliseconds)', function() {
	'use strict';

	var limiter;

	var windowMaximumCount;
	var windowDurationMilliseconds;
	var concurrency;

	beforeEach(function() {
		limiter = new RateLimiter(windowMaximumCount = 2, windowDurationMilliseconds = 25, concurrency = null);
	});

	describe('and tasks are scheduled', function() {
		var spies;
		var promises;

		var start;

		beforeEach(function() {
			start = new Date();

			spies = [ ];
			promises = [ ];

			for (var i = 0; i < 10; i++) {
				var spy = jasmine.createSpy('spy');

				spies.push(spy);

				promises.push(limiter.enqueue(spy));
			}
		});

		it('the tasks not finish before the earliest possible moment', function(done) {
			var promise = null;

			var getValidatedPromise = function(promise, index) {
				return promise.then(function() {
					var end = new Date();
					var duration = end.getTime() - start.getTime();

					var shortestPossibleDuration = Math.floor(index / windowMaximumCount) * windowDurationMilliseconds;

					expect(duration + 1).not.toBeLessThan(shortestPossibleDuration);
				});
			};

			for (var i = 0; i < promises.length; i++) {
				var p = getValidatedPromise(promises[i], i);

				if (promise === null) {
					promise = p;
				} else {
					promise = promise.then(function() {
						return p;
					});
				}
			}

			promise
				.then(function() {
					done();
				});
		});
	});
});