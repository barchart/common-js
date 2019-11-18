const promise = require('./../../../lang/promise');

describe('When a timeout is set for a promise', () => {
	'use strict';

	describe('on a promise that has already been resolved', () => {
		let originalPromise;
		let timeoutPromise;

		let result;

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

	describe('on a promise that has already been rejected', () => {
		let originalPromise;
		let timeoutPromise;

		let result;

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

	describe('on a promise that resolves quickly', () => {
		let originalPromise;
		let timeoutPromise;

		let result;

		beforeEach(function () {
			originalPromise = new Promise(function (resolveCallback, rejectCallback) {
				setTimeout(() => {
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

	describe('on a promise that rejects quickly', () => {
		let originalPromise;
		let timeoutPromise;

		let result;

		beforeEach(function () {
			originalPromise = new Promise(function (resolveCallback, rejectCallback) {
				setTimeout(() => {
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

	describe('on a promise that resolves slowly', () => {
		let originalPromise;
		let timeoutPromise;

		let result;

		beforeEach(function () {
			originalPromise = new Promise(function (resolveCallback, rejectCallback) {
				setTimeout(() => {
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

	describe('on a promise that rejects slowly', () => {
		let originalPromise;
		let timeoutPromise;

		let result;

		beforeEach(function () {
			originalPromise = new Promise(function (resolveCallback, rejectCallback) {
				setTimeout(() => {
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

	describe('on a promise that will never resolve', () => {
		let originalPromise;
		let timeoutPromise;

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

describe('When using the "promise.map" function', () => {
	'use strict';

	describe('with an asynchronous, promise-based mapper', () => {
		describe('and the array has zero items', () => {
			let mapPromise;

			let mapItems;
			let mapSpy;

			beforeEach(() => {
				mapItems = [ ];
			});

			describe('and the concurrency level is zero', () => {
				beforeEach(() => {
					mapPromise = promise.map(mapItems, mapSpy = jasmine.createSpy('mapSpy'), 0);
				});

				it('the result should be an empty array', function(done) {
					mapPromise.then(function(results) {
						expect(results.length).toEqual(0);

						done();
					});
				});

				it('the mapping function should not have been called', function(done) {
					mapPromise.then(function(results) {
						expect(mapSpy).not.toHaveBeenCalled();

						done();
					});
				});
			});

			describe('and the concurrency level is six', () => {
				beforeEach(() => {
					mapPromise = promise.map(mapItems, mapSpy = jasmine.createSpy('mapSpy'), 6);
				});

				it('the result should be an empty array', function(done) {
					mapPromise.then(function(results) {
						expect(results.length).toEqual(0);

						done();
					});
				});

				it('the mapping function should not have been called', function(done) {
					mapPromise.then(function(results) {
						expect(mapSpy).not.toHaveBeenCalled();

						done();
					});
				});
			});
		});

		describe('and the array has three items', () => {
			let mapPromise;

			let mapItems;
			let mapSpy;

			let first;
			let second;
			let third;

			beforeEach(() => {
				mapItems = [ first = { }, second = { }, third = { } ];
			});

			describe('and the concurrency level is zero', () => {
				beforeEach(() => {
					mapPromise = promise.map(mapItems, mapSpy = getMapSpy(), 0);
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

				it('the result for the first item should be first', function(done) {
					mapPromise.then(function(results) {
						expect(results[0].item).toBe(first);

						done();
					});
				});

				it('the result for the second item should be second', function(done) {
					mapPromise.then(function(results) {
						expect(results[1].item).toBe(second);

						done();
					});
				});

				it('the result for the third item should be third', function(done) {
					mapPromise.then(function(results) {
						expect(results[2].item).toBe(third);

						done();
					});
				});
			});

			describe('and the concurrency level is one', () => {
				beforeEach(() => {
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

				it('the result for the first item should be first', function(done) {
					mapPromise.then(function(results) {
						expect(results[0].item).toBe(first);

						done();
					});
				});

				it('the result for the second item should be second', function(done) {
					mapPromise.then(function(results) {
						expect(results[1].item).toBe(second);

						done();
					});
				});

				it('the result for the third item should be third', function(done) {
					mapPromise.then(function(results) {
						expect(results[2].item).toBe(third);

						done();
					});
				});
			});

			describe('and the concurrency level is two', () => {
				beforeEach(() => {
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

				it('the result for the first item should be first', function(done) {
					mapPromise.then(function(results) {
						expect(results[0].item).toBe(first);

						done();
					});
				});

				it('the result for the second item should be second', function(done) {
					mapPromise.then(function(results) {
						expect(results[1].item).toBe(second);

						done();
					});
				});

				it('the result for the third item should be third', function(done) {
					mapPromise.then(function(results) {
						expect(results[2].item).toBe(third);

						done();
					});
				});
			});

			describe('and the concurrency level is three', () => {
				beforeEach(() => {
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

				it('the result for the first item should be first', function(done) {
					mapPromise.then(function(results) {
						expect(results[0].item).toBe(first);

						done();
					});
				});

				it('the result for the second item should be second', function(done) {
					mapPromise.then(function(results) {
						expect(results[1].item).toBe(second);

						done();
					});
				});

				it('the result for the third item should be third', function(done) {
					mapPromise.then(function(results) {
						expect(results[2].item).toBe(third);

						done();
					});
				});
			});

			describe('and the concurrency level is four', () => {
				beforeEach(() => {
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

				it('the result for the first item should be first', function(done) {
					mapPromise.then(function(results) {
						expect(results[0].item).toBe(first);

						done();
					});
				});

				it('the result for the second item should be second', function(done) {
					mapPromise.then(function(results) {
						expect(results[1].item).toBe(second);

						done();
					});
				});

				it('the result for the third item should be third', function(done) {
					mapPromise.then(function(results) {
						expect(results[2].item).toBe(third);

						done();
					});
				});
			});
		});

		describe('and the array has four items (with a concurrency level of two)', () => {
			let mapPromise;

			let mapItems;
			let mapSpy;

			let first;
			let second;
			let third;
			let fourth;

			beforeEach(() => {
				mapItems = [ first = { }, second = { }, third = { }, fourth = { } ];
			});

			describe('and the first item takes a long time to process', () => {
				beforeEach(() => {
					mapPromise = promise.map(mapItems, mapSpy = jasmine.createSpy('mapSpy').and.callFake(function(item) {
						let delay;

						if (item === first) {
							delay = 30;
						} else {
							delay = 5;
						}

						let startDate = new Date();

						return new Promise(function(resolveCallback, rejectCallback) {
							setTimeout(() => {
								let endDate = new Date();

								resolveCallback({
									item: item,
									start: startDate.getTime(),
									end: endDate.getTime()
								});
							}, delay);
						});
					}), 2);
				});

				it('the result for the first item should be first', function(done) {
					mapPromise.then(function(results) {
						expect(results[0].item).toBe(first);

						done();
					});
				});

				it('the result for the second item should be second', function(done) {
					mapPromise.then(function(results) {
						expect(results[1].item).toBe(second);

						done();
					});
				});

				it('the result for the third item should be third', function(done) {
					mapPromise.then(function(results) {
						expect(results[2].item).toBe(third);

						done();
					});
				});

				it('the result for the fourth item should be fourth', function(done) {
					mapPromise.then(function(results) {
						expect(results[3].item).toBe(fourth);

						done();
					});
				});
			});
		});

		let getMapSpy = () => {
			return jasmine.createSpy('mapSpy').and.callFake(function(item) {
				let startDate = new Date();

				return new Promise(function(resolveCallback, rejectCallback) {
					setTimeout(() => {
						let endDate = new Date();

						resolveCallback({
							item: item,
							start: startDate.getTime(),
							end: endDate.getTime()
						});
					}, 5);
				});
			});
		};
	});

	describe('with an synchronous mapper', () => {
		describe('and the array has no items (with an infinite concurrency level)', () => {
			let mapPromise;

			let mapItems;
			let mapSpy;

			beforeEach(() => {
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

		describe('and the array has two items (with an infinite concurrency level)', () => {
			let mapPromise;

			let mapItems;
			let mapSpy;

			beforeEach(() => {
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
	});

	let getConcurrency = function(results, index) {
		let current = results[index];

		let concurrency = 0;

		for (let i = 0; i < results.length; i++) {
			let other = results[i];

			if (!(other.end <= current.start || other.start >= current.end)) {
				concurrency = concurrency + 1;
			}
		}

		return concurrency;
	};

	let getMaximumConcurrency = function(results) {
		let maximum = 0;

		for (let i = 0; i < results.length; i++) {
			maximum = Math.max(getConcurrency(results, i), maximum);
		}

		return maximum;
	};
});

describe('When processing a "pipeline" of promises', () => {
	'use strict';

	describe('and no executors are specified', () => {
		let input;
		let p;

		beforeEach(() => {
			p = promise.pipeline([], input = { });
		});

		it('should return the original input', function(done) {
			p.then(function(result) {
				expect(result).toBe(input);

				done();
			});
		});
	});

	describe('and one asynchronous executor is specified', () => {
		let input;

		let spyOne;

		let p;

		beforeEach(() => {
			let delayedSquare = function(x) {
				return new Promise((resolveCallback) => {
					setTimeout(() => {
						resolveCallback(x * x);
					}, 10);
				});
			};

			spyOne = jasmine.createSpy('spyOne').and.callFake(delayedSquare);

			p = promise.pipeline([ spyOne ], input = 2);
		});

		it('the first executor should be called with the input', function(done) {
			p.then(function(result) {
				expect(spyOne).toHaveBeenCalledWith(2);

				done();
			});
		});

		it('the promise should return the correct result', function(done) {
			p.then(function(result) {
				expect(result).toEqual(4);

				done();
			});
		});
	});

	describe('and two asynchronous executors are specified', () => {
		let input;

		let spyOne;
		let spyTwo;

		let p;

		beforeEach(() => {
			let delayedSquare = function(x) {
				return new Promise((resolveCallback) => {
					setTimeout(() => {
						resolveCallback(x * x);
					}, 10);
				});
			};

			spyOne = jasmine.createSpy('spyOne').and.callFake(delayedSquare);
			spyTwo = jasmine.createSpy('spyTwo').and.callFake(delayedSquare);

			p = promise.pipeline([ spyOne, spyTwo ], input = 2);
		});

		it('the first executor should be called with the input', function(done) {
			p.then(function(result) {
				expect(spyOne).toHaveBeenCalledWith(2);

				done();
			});
		});

		it('the second executor should be called with the result of the first executor', function(done) {
			p.then(function(result) {
				expect(spyTwo).toHaveBeenCalledWith(4);

				done();
			});
		});

		it('the promise should return the correct result', function(done) {
			p.then(function(result) {
				expect(result).toEqual(16);

				done();
			});
		});
	});
	
	describe('and one synchronous executor is specified', () => {
		let input;

		let spyOne;

		let p;

		beforeEach(() => {
			let synchronousSquare = function(x) {
				return x * x;
			};

			spyOne = jasmine.createSpy('spyOne').and.callFake(synchronousSquare);

			p = promise.pipeline([ spyOne ], input = 2);
		});

		it('the first executor should be called with the input', function(done) {
			p.then(function(result) {
				expect(spyOne).toHaveBeenCalledWith(2);

				done();
			});
		});

		it('the promise should return the correct result', function(done) {
			p.then(function(result) {
				expect(result).toEqual(4);

				done();
			});
		});
	});

	describe('and two synchronous executors are specified', () => {
		let input;

		let spyOne;
		let spyTwo;

		let p;

		beforeEach(() => {
			let synchronousSquare = function(x) {
				return x * x;
			};

			spyOne = jasmine.createSpy('spyOne').and.callFake(synchronousSquare);
			spyTwo = jasmine.createSpy('spyTwo').and.callFake(synchronousSquare);

			p = promise.pipeline([ spyOne, spyTwo ], input = 2);
		});

		it('the first executor should be called with the input', function(done) {
			p.then(function(result) {
				expect(spyOne).toHaveBeenCalledWith(2);

				done();
			});
		});

		it('the second executor should be called with the result of the first executor', function(done) {
			p.then(function(result) {
				expect(spyTwo).toHaveBeenCalledWith(4);

				done();
			});
		});

		it('the promise should return the correct result', function(done) {
			p.then(function(result) {
				expect(result).toEqual(16);

				done();
			});
		});
	});

	describe('and an executor throws an exception', () => {
		let input;

		let spyOne;
		let spyTwo;

		let p;

		beforeEach(() => {
			let synchronousException = function(x) {
				throw new Exception('oops');
			};
			
			let synchronousSquare = function(x) {
				return x * x;
			};

			spyOne = jasmine.createSpy('spyOne').and.callFake(synchronousException);
			spyTwo = jasmine.createSpy('spyTwo').and.callFake(synchronousSquare);

			p = promise.pipeline([ spyOne, spyTwo ], input = 2);
		});

		it('the promise should reject', function(done) {
			p.catch(function(error) {
				expect(error instanceof Error).toEqual(true);

				done();
			});
		});

		it('the first executor should be called with the input', function(done) {
			p.catch(function(error) {
				expect(spyOne).toHaveBeenCalledWith(2);

				done();
			});
		});

		it('the second executor not have should be called with the result of the first executor', function(done) {
			p.catch(function(error) {
				expect(spyTwo).not.toHaveBeenCalled();

				done();
			});
		});
	});
});

describe('When "promise.build" is used to create a promise', () => {
	'use strict';

	describe('and the executor resolves', () => {
		let p;

		beforeEach(() => {
			p = promise.build(function(r, x) {
				r('ok');
			});
		});

		it('the promise should be fulfilled', function(done) {
			p.then(function(result) {
				expect(result).toEqual('ok');

				done();
			});
		});
	});

	describe('and the executor rejects', () => {
		let p;

		beforeEach(() => {
			p = promise.build(function(r, x) {
				x('not ok');
			});
		});

		it('the promise should be fulfilled', function(done) {
			p.catch(function(result) {
				expect(result).toEqual('not ok');

				done();
			});
		});
	});

	describe('and the executor throws an error', () => {
		let p;
		let e;

		beforeEach(() => {
			p = promise.build(function(r, x) {
				e = new Error('oops');

				throw e;
			});
		});

		it('the promise should be rejected', function(done) {
			p.catch(function(error) {
				expect(error).toBe(e);

				done();
			});
		});
	});
});