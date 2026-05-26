const promise = require('./../../../lang/promise');

describe('When a timeout is set for a promise', () => {
	'use strict';

	describe('on a promise that has already been resolved', () => {
		let originalPromise;
		let timeoutPromise;

		let result;

		beforeEach(() => {
			originalPromise = Promise.resolve(result = 'instant');
			timeoutPromise = promise.timeout(originalPromise, 10);
		});

		it('it will resolve', (done) => {
			timeoutPromise.then((r) => {
				expect(r).toBe(result);

				done();
			});
		});
	});

	describe('on a promise that has already been rejected', () => {
		let originalPromise;
		let timeoutPromise;

		let result;

		beforeEach(() => {
			originalPromise = Promise.reject(result = 'instant');
			timeoutPromise = promise.timeout(originalPromise, 10);
		});

		it('it reject normally', (done) => {
			timeoutPromise.catch((r) => {
				expect(r).toBe(result);

				done();
			});
		});
	});

	describe('on a promise that resolves quickly', () => {
		let originalPromise;
		let timeoutPromise;

		let result;

		beforeEach(() => {
			originalPromise = new Promise((resolveCallback, rejectCallback) => {
				setTimeout(() => {
					resolveCallback(result = 'quick');
				}, 5);
			});

			timeoutPromise = promise.timeout(originalPromise, 10);
		});

		it('it will resolve', (done) => {
			timeoutPromise.then((r) => {
				expect(r).toBe(result);

				done();
			});
		});
	});

	describe('on a promise that rejects quickly', () => {
		let originalPromise;
		let timeoutPromise;

		let result;

		beforeEach(() => {
			originalPromise = new Promise((resolveCallback, rejectCallback) => {
				setTimeout(() => {
					rejectCallback(result = 'quick');
				}, 5);
			});

			timeoutPromise = promise.timeout(originalPromise, 10);
		});

		it('it reject normally', (done) => {
			timeoutPromise.catch((r) => {
				expect(r).toBe(result);

				done();
			});
		});
	});

	describe('on a promise that resolves slowly', () => {
		let originalPromise;
		let timeoutPromise;

		let result;

		beforeEach(() => {
			originalPromise = new Promise((resolveCallback, rejectCallback) => {
				setTimeout(() => {
					resolveCallback(result = 'slow');
				}, 20);
			});

			timeoutPromise = promise.timeout(originalPromise, 10);
		});

		it('will reject due to timeout', (done) => {
			timeoutPromise.catch(() => {
				expect(true).toBe(true);

				done();
			});
		});
	});

	describe('on a promise that rejects slowly', () => {
		let originalPromise;
		let timeoutPromise;

		let result;

		beforeEach(() => {
			originalPromise = new Promise((resolveCallback, rejectCallback) => {
				setTimeout(() => {
					rejectCallback(result = 'slow');
				}, 20);
			});

			timeoutPromise = promise.timeout(originalPromise, 10);
		});

		it('it reject normally', (done) => {
			timeoutPromise.catch((r) => {
				expect(r).not.toBe(result);

				done();
			});
		});
	});

	describe('on a promise that will never resolve', () => {
		let originalPromise;
		let timeoutPromise;

		beforeEach(() => {
			originalPromise = new Promise((resolveCallback, rejectCallback) => {
				return;
			});

			timeoutPromise = promise.timeout(originalPromise, 10);
		});

		it('will reject due to timeout', (done) => {
			timeoutPromise.catch(() => {
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

				it('the result should be an empty array', (done) => {
					mapPromise.then((results) => {
						expect(results.length).toEqual(0);

						done();
					});
				});

				it('the mapping function should not have been called', (done) => {
					mapPromise.then((results) => {
						expect(mapSpy).not.toHaveBeenCalled();

						done();
					});
				});
			});

			describe('and the concurrency level is six', () => {
				beforeEach(() => {
					mapPromise = promise.map(mapItems, mapSpy = jasmine.createSpy('mapSpy'), 6);
				});

				it('the result should be an empty array', (done) => {
					mapPromise.then((results) => {
						expect(results.length).toEqual(0);

						done();
					});
				});

				it('the mapping function should not have been called', (done) => {
					mapPromise.then((results) => {
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

				it('the maximum concurrency level should be three', (done) => {
					mapPromise.then((results) => {
						expect(getMaximumConcurrency(results)).toEqual(3);

						done();
					});
				});

				it('the actual concurrency for the first item should be three', (done) => {
					mapPromise.then((results) => {
						expect(getConcurrency(results, 0)).toEqual(3);

						done();
					});
				});

				it('the result for the first item should be first', (done) => {
					mapPromise.then((results) => {
						expect(results[0].item).toBe(first);

						done();
					});
				});

				it('the result for the second item should be second', (done) => {
					mapPromise.then((results) => {
						expect(results[1].item).toBe(second);

						done();
					});
				});

				it('the result for the third item should be third', (done) => {
					mapPromise.then((results) => {
						expect(results[2].item).toBe(third);

						done();
					});
				});
			});

			describe('and the concurrency level is one', () => {
				beforeEach(() => {
					mapPromise = promise.map(mapItems, mapSpy = getMapSpy(), 1);
				});

				it('the maximum concurrency level should be one', (done) => {
					mapPromise.then((results) => {
						expect(getMaximumConcurrency(results)).toEqual(1);

						done();
					});
				});

				it('the actual concurrency for the first item should be one', (done) => {
					mapPromise.then((results) => {
						expect(getConcurrency(results, 0)).toEqual(1);

						done();
					});
				});

				it('the result for the first item should be first', (done) => {
					mapPromise.then((results) => {
						expect(results[0].item).toBe(first);

						done();
					});
				});

				it('the result for the second item should be second', (done) => {
					mapPromise.then((results) => {
						expect(results[1].item).toBe(second);

						done();
					});
				});

				it('the result for the third item should be third', (done) => {
					mapPromise.then((results) => {
						expect(results[2].item).toBe(third);

						done();
					});
				});
			});

			describe('and the concurrency level is two', () => {
				beforeEach(() => {
					mapPromise = promise.map(mapItems, mapSpy = getMapSpy(), 2);
				});

				it('the maximum concurrency level should be two', (done) => {
					mapPromise.then((results) => {
						expect(getMaximumConcurrency(results)).toEqual(2);

						done();
					});
				});

				it('the actual concurrency for the first item should be two', (done) => {
					mapPromise.then((results) => {
						expect(getConcurrency(results, 0)).toEqual(2);

						done();
					});
				});

				it('the result for the first item should be first', (done) => {
					mapPromise.then((results) => {
						expect(results[0].item).toBe(first);

						done();
					});
				});

				it('the result for the second item should be second', (done) => {
					mapPromise.then((results) => {
						expect(results[1].item).toBe(second);

						done();
					});
				});

				it('the result for the third item should be third', (done) => {
					mapPromise.then((results) => {
						expect(results[2].item).toBe(third);

						done();
					});
				});
			});

			describe('and the concurrency level is three', () => {
				beforeEach(() => {
					mapPromise = promise.map(mapItems, mapSpy = getMapSpy(), 3);
				});

				it('the maximum concurrency level should be three', (done) => {
					mapPromise.then((results) => {
						expect(getMaximumConcurrency(results)).toEqual(3);

						done();
					});
				});

				it('the actual concurrency for the first item should be three', (done) => {
					mapPromise.then((results) => {
						expect(getConcurrency(results, 0)).toEqual(3);

						done();
					});
				});

				it('the result for the first item should be first', (done) => {
					mapPromise.then((results) => {
						expect(results[0].item).toBe(first);

						done();
					});
				});

				it('the result for the second item should be second', (done) => {
					mapPromise.then((results) => {
						expect(results[1].item).toBe(second);

						done();
					});
				});

				it('the result for the third item should be third', (done) => {
					mapPromise.then((results) => {
						expect(results[2].item).toBe(third);

						done();
					});
				});
			});

			describe('and the concurrency level is four', () => {
				beforeEach(() => {
					mapPromise = promise.map(mapItems, mapSpy = getMapSpy(), 4);
				});

				it('the maximum concurrency level should be three', (done) => {
					mapPromise.then((results) => {
						expect(getMaximumConcurrency(results)).toEqual(3);

						done();
					});
				});

				it('the actual concurrency for the first item should be three', (done) => {
					mapPromise.then((results) => {
						expect(getConcurrency(results, 0)).toEqual(3);

						done();
					});
				});

				it('the result for the first item should be first', (done) => {
					mapPromise.then((results) => {
						expect(results[0].item).toBe(first);

						done();
					});
				});

				it('the result for the second item should be second', (done) => {
					mapPromise.then((results) => {
						expect(results[1].item).toBe(second);

						done();
					});
				});

				it('the result for the third item should be third', (done) => {
					mapPromise.then((results) => {
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
					mapPromise = promise.map(mapItems, mapSpy = jasmine.createSpy('mapSpy').and.callFake((item) => {
						let delay;

						if (item === first) {
							delay = 30;
						} else {
							delay = 5;
						}

						let startDate = new Date();

						return new Promise((resolveCallback, rejectCallback) => {
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

				it('the result for the first item should be first', (done) => {
					mapPromise.then((results) => {
						expect(results[0].item).toBe(first);

						done();
					});
				});

				it('the result for the second item should be second', (done) => {
					mapPromise.then((results) => {
						expect(results[1].item).toBe(second);

						done();
					});
				});

				it('the result for the third item should be third', (done) => {
					mapPromise.then((results) => {
						expect(results[2].item).toBe(third);

						done();
					});
				});

				it('the result for the fourth item should be fourth', (done) => {
					mapPromise.then((results) => {
						expect(results[3].item).toBe(fourth);

						done();
					});
				});
			});
		});

		let getMapSpy = () => {
			return jasmine.createSpy('mapSpy').and.callFake((item) => {
				let startDate = new Date();

				return new Promise((resolveCallback, rejectCallback) => {
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

			it('the result will be an array', (done) => {
				mapPromise.then((results) => {
					expect(results instanceof Array).toEqual(true);

					done();
				});
			});

			it('the resulting array will be the same size as the input array', (done) => {
				mapPromise.then((results) => {
					expect(results.length).toEqual(mapItems.length);

					done();
				});
			});

			it('the mapper function will be not have been called', (done) => {
				mapPromise.then((results) => {
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

			it('the result will be an array', (done) => {
				mapPromise.then((results) => {
					expect(results instanceof Array).toEqual(true);

					done();
				});
			});

			it('the resulting array have two items', (done) => {
				mapPromise.then((results) => {
					expect(results.length).toEqual(2);

					done();
				});
			});

			it('the mapper function to have been called twice', (done) => {
				mapPromise.then((results) => {
					expect(mapSpy.calls.count()).toEqual(2);

					done();
				});
			});

			it('the mapper function will have been called once with the first item', (done) => {
				mapPromise.then((results) => {
					expect(mapSpy).toHaveBeenCalledWith(mapItems[0]);

					done();
				});
			});

			it('the mapper function will have been called once with the second item', (done) => {
				mapPromise.then((results) => {
					expect(mapSpy).toHaveBeenCalledWith(mapItems[1]);

					done();
				});
			});
		});
	});

	let getConcurrency = (results, index) => {
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

	let getMaximumConcurrency = (results) => {
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

		it('should return the original input', (done) => {
			p.then((result) => {
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
			let delayedSquare = (x) => {
				return new Promise((resolveCallback) => {
					setTimeout(() => {
						resolveCallback(x * x);
					}, 10);
				});
			};

			spyOne = jasmine.createSpy('spyOne').and.callFake(delayedSquare);

			p = promise.pipeline([ spyOne ], input = 2);
		});

		it('the first executor should be called with the input', (done) => {
			p.then((result) => {
				expect(spyOne).toHaveBeenCalledWith(2);

				done();
			});
		});

		it('the promise should return the correct result', (done) => {
			p.then((result) => {
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
			let delayedSquare = (x) => {
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

		it('the first executor should be called with the input', (done) => {
			p.then((result) => {
				expect(spyOne).toHaveBeenCalledWith(2);

				done();
			});
		});

		it('the second executor should be called with the result of the first executor', (done) => {
			p.then((result) => {
				expect(spyTwo).toHaveBeenCalledWith(4);

				done();
			});
		});

		it('the promise should return the correct result', (done) => {
			p.then((result) => {
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
			let synchronousSquare = (x) => {
				return x * x;
			};

			spyOne = jasmine.createSpy('spyOne').and.callFake(synchronousSquare);

			p = promise.pipeline([ spyOne ], input = 2);
		});

		it('the first executor should be called with the input', (done) => {
			p.then((result) => {
				expect(spyOne).toHaveBeenCalledWith(2);

				done();
			});
		});

		it('the promise should return the correct result', (done) => {
			p.then((result) => {
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
			let synchronousSquare = (x) => {
				return x * x;
			};

			spyOne = jasmine.createSpy('spyOne').and.callFake(synchronousSquare);
			spyTwo = jasmine.createSpy('spyTwo').and.callFake(synchronousSquare);

			p = promise.pipeline([ spyOne, spyTwo ], input = 2);
		});

		it('the first executor should be called with the input', (done) => {
			p.then((result) => {
				expect(spyOne).toHaveBeenCalledWith(2);

				done();
			});
		});

		it('the second executor should be called with the result of the first executor', (done) => {
			p.then((result) => {
				expect(spyTwo).toHaveBeenCalledWith(4);

				done();
			});
		});

		it('the promise should return the correct result', (done) => {
			p.then((result) => {
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
			let synchronousException = (x) => {
				throw new Exception('oops');
			};
			
			let synchronousSquare = (x) => {
				return x * x;
			};

			spyOne = jasmine.createSpy('spyOne').and.callFake(synchronousException);
			spyTwo = jasmine.createSpy('spyTwo').and.callFake(synchronousSquare);

			p = promise.pipeline([ spyOne, spyTwo ], input = 2);
		});

		it('the promise should reject', (done) => {
			p.catch((error) => {
				expect(error instanceof Error).toEqual(true);

				done();
			});
		});

		it('the first executor should be called with the input', (done) => {
			p.catch((error) => {
				expect(spyOne).toHaveBeenCalledWith(2);

				done();
			});
		});

		it('the second executor not have should be called with the result of the first executor', (done) => {
			p.catch((error) => {
				expect(spyTwo).not.toHaveBeenCalled();

				done();
			});
		});
	});
});

describe('When searching for the "first" valid promise', () => {
	describe('with an empty array', () => {
		let result;

		beforeEach((done) => {
			promise.first([])
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the result should be a null value', () => {
			expect(result).toEqual(null);
		});
	});

	describe('with an array of two executors, where both return null', () => {
		let one;
		let two;

		let result;

		beforeEach((done) => {
			one = jasmine.createSpy('one').and.returnValue(Promise.resolve(null));
			two = jasmine.createSpy('two').and.returnValue(Promise.resolve(null));

			promise.first([ one, two ])
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the result should be a null value', () => {
			expect(result).toEqual(null);
		});

		it('the first executor should have been invoked', () => {
			expect(one).toHaveBeenCalled();
		});

		it('the second executor should have been invoked', () => {
			expect(two).toHaveBeenCalled();
		});
	});

	describe('with an array of two executors, where both return values', () => {
		let one;
		let two;

		let valueOne;
		let valueTwo;

		let result;

		beforeEach((done) => {
			valueOne = { };
			valueTwo = { };

			one = jasmine.createSpy('one').and.returnValue(Promise.resolve(valueOne));
			two = jasmine.createSpy('two').and.returnValue(Promise.resolve(valueTwo));

			promise.first([ one, two ])
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the result the value from the first executor', () => {
			expect(result).toBe(valueOne);
		});

		it('the first executor should have been invoked', () => {
			expect(one).toHaveBeenCalled();
		});

		it('the second executor should not have been invoked', () => {
			expect(two).not.toHaveBeenCalled();
		});
	});

	describe('with an array of two executors, where only the last returns a value', () => {
		let one;
		let two;

		let valueOne;
		let valueTwo;

		let result;

		beforeEach((done) => {
			valueOne = null;
			valueTwo = { };

			one = jasmine.createSpy('one').and.returnValue(Promise.resolve(valueOne));
			two = jasmine.createSpy('two').and.returnValue(Promise.resolve(valueTwo));

			promise.first([ one, two ])
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the result the value from the second executor', () => {
			expect(result).toBe(valueTwo);
		});

		it('the first executor should have been invoked', () => {
			expect(one).toHaveBeenCalled();
		});

		it('the second executor should have been invoked', () => {
			expect(two).toHaveBeenCalled();
		});
	});

	describe('with an array of two executors, where the first returns a rejected promise', () => {
		let one;
		let two;

		let valueTwo;

		let result;

		beforeEach((done) => {
			valueTwo = { };

			one = jasmine.createSpy('one').and.returnValue(Promise.reject('Oops'));
			two = jasmine.createSpy('two').and.returnValue(Promise.resolve(valueTwo));

			promise.first([ one, two ])
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the result the value from the second executor', () => {
			expect(result).toBe(valueTwo);
		});

		it('the first executor should have been invoked', () => {
			expect(one).toHaveBeenCalled();
		});

		it('the second executor should have been invoked', () => {
			expect(two).toHaveBeenCalled();
		});
	});
});

describe('When "promise.build" is used to create a promise', () => {
	'use strict';

	describe('and the executor resolves', () => {
		let p;

		beforeEach(() => {
			p = promise.build((r, x) => {
				r('ok');
			});
		});

		it('the promise should be fulfilled', (done) => {
			p.then((result) => {
				expect(result).toEqual('ok');

				done();
			});
		});
	});

	describe('and the executor rejects', () => {
		let p;

		beforeEach(() => {
			p = promise.build((r, x) => {
				x('not ok');
			});
		});

		it('the promise should be fulfilled', (done) => {
			p.catch((result) => {
				expect(result).toEqual('not ok');

				done();
			});
		});
	});

	describe('and the executor throws an error', () => {
		let p;
		let e;

		beforeEach(() => {
			p = promise.build((r, x) => {
				e = new Error('oops');

				throw e;
			});
		});

		it('the promise should be rejected', (done) => {
			p.catch((error) => {
				expect(error).toBe(e);

				done();
			});
		});
	});
});