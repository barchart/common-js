var promise = require('./../../../lang/promise');

describe('When a timeout is set for a promise', function() {
	'use strict';

	describe('on a promise that has already been resolved', function() {
		var originalPromise;
		var timeoutPromise;

		var result;

		beforeEach(function () {
			originalPromise = Promise.resolve(result = 'instant');
			timeoutPromise = promise.timeout(originalPromise, 10);
		});

		it('it will resolve', function (done) {
			timeoutPromise.then(function (r) {
				expect(r).toBe(result);

				done();
			});
		});
	});

	describe('on a promise that has already been rejected', function() {
		var originalPromise;
		var timeoutPromise;

		var result;

		beforeEach(function () {
			originalPromise = Promise.reject(result = 'instant');
			timeoutPromise = promise.timeout(originalPromise, 10);
		});

		it('it reject normally', function (done) {
			timeoutPromise.catch(function (r) {
				expect(r).toBe(result);

				done();
			});
		});
	});

	describe('on a promise that resolves quickly', function() {
		var originalPromise;
		var timeoutPromise;

		var result;

		beforeEach(function () {
			originalPromise = new Promise(function (resolveCallback, rejectCallback) {
				setTimeout(function() {
					resolveCallback(result = 'quick');
				}, 5);
			});

			timeoutPromise = promise.timeout(originalPromise, 10);
		});

		it('it will resolve', function (done) {
			timeoutPromise.then(function (r) {
				expect(r).toBe(result);

				done();
			});
		});
	});

	describe('on a promise that rejects quickly', function() {
		var originalPromise;
		var timeoutPromise;

		var result;

		beforeEach(function () {
			originalPromise = new Promise(function (resolveCallback, rejectCallback) {
				setTimeout(function() {
					rejectCallback(result = 'quick');
				}, 5);
			});

			timeoutPromise = promise.timeout(originalPromise, 10);
		});

		it('it reject normally', function (done) {
			timeoutPromise.catch(function (r) {
				expect(r).toBe(result);

				done();
			});
		});
	});

	describe('on a promise that resolves slowly', function() {
		var originalPromise;
		var timeoutPromise;

		var result;

		beforeEach(function () {
			originalPromise = new Promise(function (resolveCallback, rejectCallback) {
				setTimeout(function() {
					resolveCallback(result = 'slow');
				}, 20);
			});

			timeoutPromise = promise.timeout(originalPromise, 10);
		});

		it('will reject due to timeout', function (done) {
			timeoutPromise.catch(function () {
				expect(true).toBe(true);

				done();
			});
		});
	});

	describe('on a promise that rejects slowly', function() {
		var originalPromise;
		var timeoutPromise;

		var result;

		beforeEach(function () {
			originalPromise = new Promise(function (resolveCallback, rejectCallback) {
				setTimeout(function() {
					rejectCallback(result = 'slow');
				}, 20);
			});

			timeoutPromise = promise.timeout(originalPromise, 10);
		});

		it('it reject normally', function (done) {
			timeoutPromise.catch(function (r) {
				expect(r).not.toBe(result);

				done();
			});
		});
	});

	describe('on a promise that will never resolve', function() {
		var originalPromise;
		var timeoutPromise;

		beforeEach(function () {
			originalPromise = new Promise(function (resolveCallback, rejectCallback) {
				return;
			});

			timeoutPromise = promise.timeout(originalPromise, 10);
		});

		it('will reject due to timeout', function (done) {
			timeoutPromise.catch(function () {
				expect(true).toBe(true);

				done();
			});
		});
	});
});

describe('When mapping an array through an promise-based function', function() {
	'use strict';

	describe('and the array has no items', function() {
		var mapPromise;

		var mapItems;
		var mapSpy;

		beforeEach(function() {
			mapPromise = promise.map(mapItems = [ ], mapSpy = jasmine.createSpy('mapSpy'));
		});

		it('the result will be an array', function(done) {
			mapPromise.then(function(results) {
				expect(results instanceof Array).toEqual(true);

				done();
			});
		});

		it('the resulting array will be the same size as the input array', function(done) {
			mapPromise.then(function(results) {
				expect(results.length).toEqual(mapItems.length);

				done();
			});
		});

		it('the mapper function will be not have been called', function(done) {
			mapPromise.then(function(results) {
				expect(mapSpy.calls.count()).toEqual(0);

				done();
			});
		});
	});

	describe('and the array has two items', function() {
		var mapPromise;

		var mapItems;
		var mapSpy;

		beforeEach(function() {
			mapPromise = promise.map(mapItems = [ 'x', 'y' ], mapSpy = jasmine.createSpy('mapSpy'));
		});

		it('the result will be an array', function(done) {
			mapPromise.then(function(results) {
				expect(results instanceof Array).toEqual(true);

				done();
			});
		});

		it('the resulting array have two items', function(done) {
			mapPromise.then(function(results) {
				expect(results.length).toEqual(2);

				done();
			});
		});

		it('the mapper function to have been called twice', function(done) {
			mapPromise.then(function(results) {
				expect(mapSpy.calls.count()).toEqual(2);

				done();
			});
		});

		it('the mapper function will have been called once with the first item', function(done) {
			mapPromise.then(function(results) {
				expect(mapSpy).toHaveBeenCalledWith(mapItems[0]);

				done();
			});
		});

		it('the mapper function will have been called once with the second item', function(done) {
			mapPromise.then(function(results) {
				expect(mapSpy).toHaveBeenCalledWith(mapItems[1]);

				done();
			});
		});
	});

	describe('and the array has three items', function() {
		var mapPromise;

		var mapItems;
		var mapSpy;

		beforeEach(function() {
			mapItems = [ 'a', 'b', 'c' ];
		});

		describe('and the concurrency level is one', function() {
			beforeEach(function() {
				mapPromise = promise.map(mapItems, mapSpy = getMapSpy(), 1);
			});

			it('the maximum concurrency level should be one', function(done) {
				mapPromise.then(function(results) {
					expect(getMaximumConcurrency(results)).toEqual(1);

					done();
				});
			});

			it('the actual concurrency for the first item should be one', function(done) {
				mapPromise.then(function(results) {
					expect(getConcurrency(results, 0)).toEqual(1);

					done();
				});
			});
		});

		describe('and the concurrency level is two', function() {
			beforeEach(function() {
				mapPromise = promise.map(mapItems, mapSpy = getMapSpy(), 2);
			});

			it('the maximum concurrency level should be two', function(done) {
				mapPromise.then(function(results) {
					expect(getMaximumConcurrency(results)).toEqual(2);

					done();
				});
			});

			it('the actual concurrency for the first item should be two', function(done) {
				mapPromise.then(function(results) {
					expect(getConcurrency(results, 0)).toEqual(2);

					done();
				});
			});
		});

		describe('and the concurrency level is three', function() {
			beforeEach(function() {
				mapPromise = promise.map(mapItems, mapSpy = getMapSpy(), 3);
			});

			it('the maximum concurrency level should be three', function(done) {
				mapPromise.then(function(results) {
					expect(getMaximumConcurrency(results)).toEqual(3);

					done();
				});
			});

			it('the actual concurrency for the first item should be three', function(done) {
				mapPromise.then(function(results) {
					expect(getConcurrency(results, 0)).toEqual(3);

					done();
				});
			});
		});

		describe('and the concurrency level is four', function() {
			beforeEach(function() {
				mapPromise = promise.map(mapItems, mapSpy = getMapSpy(), 4);
			});

			it('the maximum concurrency level should be three', function(done) {
				mapPromise.then(function(results) {
					expect(getMaximumConcurrency(results)).toEqual(3);

					done();
				});
			});

			it('the actual concurrency for the first item should be three', function(done) {
				mapPromise.then(function(results) {
					expect(getConcurrency(results, 0)).toEqual(3);

					done();
				});
			});
		});
	});

	var getMapSpy = function() {
		return jasmine.createSpy('mapSpy').and.callFake(function() {
			var startDate = new Date();

			return new Promise(function(resolveCallback, rejectCallback) {
				setTimeout(function() {
					var endDate = new Date();

					resolveCallback({
						start: startDate.getTime(),
						end: endDate.getTime()
					});
				}, 15);
			});
		});
	};

	var getConcurrency = function(results, index) {
		var current = results[index];

		var concurrency = 0;

		for (var i = 0; i < results.length; i++) {
			var other = results[i];

			if (!(other.end <= current.start || other.start >= current.end)) {
				concurrency = concurrency + 1;
			}
		}

		return concurrency;
	};

	var getMaximumConcurrency = function(results) {
		var maximum = 0;

		for (var i = 0; i < results.length; i++) {
			maximum = Math.max(getConcurrency(results, i), maximum);
		}

		return maximum;
	};
});