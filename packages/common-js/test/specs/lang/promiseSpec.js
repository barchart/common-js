import * as promise from './../../../lang/promise.js';

describe('When a timeout is set for a promise', () => {
	'use strict';

	describe('on a promise that has already been resolved', () => {
		let originalPromise;
		let timeoutPromise;

		let result;

		beforeEach(() => {
			originalPromise = (async () => result = 'instant')();
			timeoutPromise = promise.timeout(originalPromise, 10);
		});

		it('it will resolve', async () => {
			const r = await timeoutPromise;

			expect(r).toBe(result);
		});
	});

	describe('on a promise that has already been rejected', () => {
		let originalPromise;
		let timeoutPromise;

		let result;

		beforeEach(() => {
			originalPromise = (async () => {
				throw result = 'instant';
			})();
			timeoutPromise = promise.timeout(originalPromise, 10);
		});

		it('it reject normally', async () => {
			let r;

			try {
				await timeoutPromise;
			} catch (e) {
				r = e;
			}

			expect(r).toBe(result);
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

		it('it will resolve', async () => {
			const r = await timeoutPromise;

			expect(r).toBe(result);
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

		it('it reject normally', async () => {
			const r = await getRejected(timeoutPromise);

			expect(r).toBe(result);
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

		it('will reject due to timeout', async () => {
			await getRejected(timeoutPromise);

			expect(true).toBe(true);
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

		it('it reject normally', async () => {
			const r = await getRejected(timeoutPromise);

			expect(r).not.toBe(result);
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

		it('will reject due to timeout', async () => {
			await getRejected(timeoutPromise);

			expect(true).toBe(true);
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

				it('the result should be an empty array', async () => {
					const results = await mapPromise;

					expect(results.length).toEqual(0);
				});

				it('the mapping function should not have been called', async () => {
					await mapPromise;

					expect(mapSpy).not.toHaveBeenCalled();
				});
			});

			describe('and the concurrency level is six', () => {
				beforeEach(() => {
					mapPromise = promise.map(mapItems, mapSpy = jasmine.createSpy('mapSpy'), 6);
				});

				it('the result should be an empty array', async () => {
					const results = await mapPromise;

					expect(results.length).toEqual(0);
				});

				it('the mapping function should not have been called', async () => {
					await mapPromise;

					expect(mapSpy).not.toHaveBeenCalled();
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

				it('the maximum concurrency level should be three', async () => {
					const results = await mapPromise;

					expect(getMaximumConcurrency(results)).toEqual(3);
				});

				it('the actual concurrency for the first item should be three', async () => {
					const results = await mapPromise;

					expect(getConcurrency(results, 0)).toEqual(3);
				});

				it('the result for the first item should be first', async () => {
					const results = await mapPromise;

					expect(results[0].item).toBe(first);
				});

				it('the result for the second item should be second', async () => {
					const results = await mapPromise;

					expect(results[1].item).toBe(second);
				});

				it('the result for the third item should be third', async () => {
					const results = await mapPromise;

					expect(results[2].item).toBe(third);
				});
			});

			describe('and the concurrency level is one', () => {
				beforeEach(() => {
					mapPromise = promise.map(mapItems, mapSpy = getMapSpy(), 1);
				});

				it('the maximum concurrency level should be one', async () => {
					const results = await mapPromise;

					expect(getMaximumConcurrency(results)).toEqual(1);
				});

				it('the actual concurrency for the first item should be one', async () => {
					const results = await mapPromise;

					expect(getConcurrency(results, 0)).toEqual(1);
				});

				it('the result for the first item should be first', async () => {
					const results = await mapPromise;

					expect(results[0].item).toBe(first);
				});

				it('the result for the second item should be second', async () => {
					const results = await mapPromise;

					expect(results[1].item).toBe(second);
				});

				it('the result for the third item should be third', async () => {
					const results = await mapPromise;

					expect(results[2].item).toBe(third);
				});
			});

			describe('and the concurrency level is two', () => {
				beforeEach(() => {
					mapPromise = promise.map(mapItems, mapSpy = getMapSpy(), 2);
				});

				it('the maximum concurrency level should be two', async () => {
					const results = await mapPromise;

					expect(getMaximumConcurrency(results)).toEqual(2);
				});

				it('the actual concurrency for the first item should be two', async () => {
					const results = await mapPromise;

					expect(getConcurrency(results, 0)).toEqual(2);
				});

				it('the result for the first item should be first', async () => {
					const results = await mapPromise;

					expect(results[0].item).toBe(first);
				});

				it('the result for the second item should be second', async () => {
					const results = await mapPromise;

					expect(results[1].item).toBe(second);
				});

				it('the result for the third item should be third', async () => {
					const results = await mapPromise;

					expect(results[2].item).toBe(third);
				});
			});

			describe('and the concurrency level is three', () => {
				beforeEach(() => {
					mapPromise = promise.map(mapItems, mapSpy = getMapSpy(), 3);
				});

				it('the maximum concurrency level should be three', async () => {
					const results = await mapPromise;

					expect(getMaximumConcurrency(results)).toEqual(3);
				});

				it('the actual concurrency for the first item should be three', async () => {
					const results = await mapPromise;

					expect(getConcurrency(results, 0)).toEqual(3);
				});

				it('the result for the first item should be first', async () => {
					const results = await mapPromise;

					expect(results[0].item).toBe(first);
				});

				it('the result for the second item should be second', async () => {
					const results = await mapPromise;

					expect(results[1].item).toBe(second);
				});

				it('the result for the third item should be third', async () => {
					const results = await mapPromise;

					expect(results[2].item).toBe(third);
				});
			});

			describe('and the concurrency level is four', () => {
				beforeEach(() => {
					mapPromise = promise.map(mapItems, mapSpy = getMapSpy(), 4);
				});

				it('the maximum concurrency level should be three', async () => {
					const results = await mapPromise;

					expect(getMaximumConcurrency(results)).toEqual(3);
				});

				it('the actual concurrency for the first item should be three', async () => {
					const results = await mapPromise;

					expect(getConcurrency(results, 0)).toEqual(3);
				});

				it('the result for the first item should be first', async () => {
					const results = await mapPromise;

					expect(results[0].item).toBe(first);
				});

				it('the result for the second item should be second', async () => {
					const results = await mapPromise;

					expect(results[1].item).toBe(second);
				});

				it('the result for the third item should be third', async () => {
					const results = await mapPromise;

					expect(results[2].item).toBe(third);
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

				it('the result for the first item should be first', async () => {
					const results = await mapPromise;

					expect(results[0].item).toBe(first);
				});

				it('the result for the second item should be second', async () => {
					const results = await mapPromise;

					expect(results[1].item).toBe(second);
				});

				it('the result for the third item should be third', async () => {
					const results = await mapPromise;

					expect(results[2].item).toBe(third);
				});

				it('the result for the fourth item should be fourth', async () => {
					const results = await mapPromise;

					expect(results[3].item).toBe(fourth);
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

			it('the result will be an array', async () => {
				const results = await mapPromise;

				expect(results instanceof Array).toEqual(true);
			});

			it('the resulting array will be the same size as the input array', async () => {
				const results = await mapPromise;

				expect(results.length).toEqual(mapItems.length);
			});

			it('the mapper function will be not have been called', async () => {
				await mapPromise;

				expect(mapSpy.calls.count()).toEqual(0);
			});
		});

		describe('and the array has two items (with an infinite concurrency level)', () => {
			let mapPromise;

			let mapItems;
			let mapSpy;

			beforeEach(() => {
				mapPromise = promise.map(mapItems = [ 'x', 'y' ], mapSpy = jasmine.createSpy('mapSpy'));
			});

			it('the result will be an array', async () => {
				const results = await mapPromise;

				expect(results instanceof Array).toEqual(true);
			});

			it('the resulting array have two items', async () => {
				const results = await mapPromise;

				expect(results.length).toEqual(2);
			});

			it('the mapper function to have been called twice', async () => {
				await mapPromise;

				expect(mapSpy.calls.count()).toEqual(2);
			});

			it('the mapper function will have been called once with the first item', async () => {
				await mapPromise;

				expect(mapSpy).toHaveBeenCalledWith(mapItems[0]);
			});

			it('the mapper function will have been called once with the second item', async () => {
				await mapPromise;

				expect(mapSpy).toHaveBeenCalledWith(mapItems[1]);
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

		it('should return the original input', async () => {
			const result = await p;

			expect(result).toBe(input);
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

		it('the first executor should be called with the input', async () => {
			await p;

			expect(spyOne).toHaveBeenCalledWith(2);
		});

		it('the promise should return the correct result', async () => {
			const result = await p;

			expect(result).toEqual(4);
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

		it('the first executor should be called with the input', async () => {
			await p;

			expect(spyOne).toHaveBeenCalledWith(2);
		});

		it('the second executor should be called with the result of the first executor', async () => {
			await p;

			expect(spyTwo).toHaveBeenCalledWith(4);
		});

		it('the promise should return the correct result', async () => {
			const result = await p;

			expect(result).toEqual(16);
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

		it('the first executor should be called with the input', async () => {
			await p;

			expect(spyOne).toHaveBeenCalledWith(2);
		});

		it('the promise should return the correct result', async () => {
			const result = await p;

			expect(result).toEqual(4);
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

		it('the first executor should be called with the input', async () => {
			 await p;

			 expect(spyOne).toHaveBeenCalledWith(2);
		});

		it('the second executor should be called with the result of the first executor', async () => {
			await p;

			expect(spyTwo).toHaveBeenCalledWith(4);
		});

		it('the promise should return the correct result', async () => {
			const result = await p;

			expect(result).toEqual(16);
		});
	});

	describe('and an executor throws an exception', () => {
		let input;

		let spyOne;
		let spyTwo;

		let p;

		beforeEach(() => {
			let synchronousException = (x) => {
				throw new Error('oops');
			};

			let synchronousSquare = (x) => {
				return x * x;
			};

			spyOne = jasmine.createSpy('spyOne').and.callFake(synchronousException);
			spyTwo = jasmine.createSpy('spyTwo').and.callFake(synchronousSquare);

			p = promise.pipeline([ spyOne, spyTwo ], input = 2);
		});

		it('the promise should reject', async () => {
			const error = await getRejected(p);

			expect(error instanceof Error).toEqual(true);
		});

		it('the first executor should be called with the input', async () => {
			await getRejected(p);

			expect(spyOne).toHaveBeenCalledWith(2);
		});

		it('the second executor not have should be called with the result of the first executor', async () => {
			await getRejected(p);

			expect(spyTwo).not.toHaveBeenCalled();
		});
	});
});

describe('When searching for the "first" valid promise', () => {
	describe('with an empty array', () => {
		let result;

		beforeEach(async () => {
			result = await promise.first([]);
		});

		it('the result should be a null value', () => {
			expect(result).toEqual(null);
		});
	});

	describe('with an array of two executors, where both return null', () => {
		let one;
		let two;

		let result;

		beforeEach(async () => {
			one = jasmine.createSpy('one').and.callFake(async () => null);
			two = jasmine.createSpy('two').and.callFake(async () => null);

			result = await promise.first([ one, two ]);
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

		beforeEach(async () => {
			valueOne = { };
			valueTwo = { };

			one = jasmine.createSpy('one').and.callFake(async () => valueOne);
			two = jasmine.createSpy('two').and.callFake(async () => valueTwo);

			result = await promise.first([ one, two ]);
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

		beforeEach(async () => {
			valueOne = null;
			valueTwo = { };

			one = jasmine.createSpy('one').and.callFake(async () => valueOne);
			two = jasmine.createSpy('two').and.callFake(async () => valueTwo);

			result = await promise.first([ one, two ]);
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

		beforeEach(async () => {
			valueTwo = { };

			one = jasmine.createSpy('one').and.callFake(async () => {
				throw 'Oops';
			});
			two = jasmine.createSpy('two').and.callFake(async () => valueTwo);

			result = await promise.first([ one, two ]);
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

		it('the promise should be fulfilled', async () => {
			const result = await p;

			expect(result).toEqual('ok');
		});
	});

	describe('and the executor rejects', () => {
		let p;

		beforeEach(() => {
			p = promise.build((r, x) => {
				x('not ok');
			});
		});

		it('the promise should be fulfilled', async () => {
			let result;

			try {
				await p;
			} catch (e) {
				result = e;
			}

			expect(result).toEqual('not ok');
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

		it('the promise should be rejected', async () => {
			let error;

			try {
				await p;
			} catch (caught) {
				error = caught;
			}

			expect(error).toBe(e);
		});
	});
});

async function getRejected(promiseToReject) {
	try {
		await promiseToReject;
	} catch (e) {
		return e;
	}

	throw new Error("Expected promise to reject.");
}
