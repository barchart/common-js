const RateLimiter = require('./../../../timing/RateLimiter');

describe('When a RateLimiter is constructed (1 execution per 25 milliseconds)', () => {
	'use strict';

	let limiter;

	let windowMaximumCount;
	let windowDurationMilliseconds;
	let concurrency;

	beforeEach(() => {
		limiter = new RateLimiter(windowMaximumCount = 1, windowDurationMilliseconds = 25, concurrency = null);
	});

	describe('and tasks are scheduled', () => {
		let spies;
		let promises;

		let start;

		beforeEach(() => {
			start = new Date();

			spies = [ ];
			promises = [ ];

			for (let i = 0; i < 10; i++) {
				 let spy = jasmine.createSpy('spy');

				spies.push(spy);

				promises.push(limiter.enqueue(spy));
			}
		});

		it('the tasks should serialized', (done) => {
			let promise = null;

			let getValidatedPromise = (promise, index) => {
				return promise.then(() => {
					for (let i = 0; i < spies.length; i++) {
						let count;

						if (i > index) {
							count = 0;
						} else {
							count = 1;
						}

						expect(spies[i].calls.count()).toEqual(count);
					}
				});
			};

			function wrapPromise(existing, next) {
				return existing.then(() => {
					return next;
				});
			}

			for (let i = 0; i < promises.length; i++) {
				let p = getValidatedPromise(promises[i], i);

				if (promise === null) {
					promise = p;
				} else {
					promise = wrapPromise(promise, p);
				}
			}

			promise
				.then(() => {
					done();
				});
		});

		it('the tasks not finish before the earliest possible moment', (done) => {
			let promise = null;

			let getValidatedPromise = (promise, index) => {
				return promise.then(() => {
					let end = new Date();
					let duration = end.getTime() - start.getTime();

					let shortestPossibleDuration = Math.floor(index / windowMaximumCount) * windowDurationMilliseconds;

					expect(duration + 1).not.toBeLessThan(shortestPossibleDuration);
				});
			};

			function wrapPromise(existing, next) {
				return existing.then(() => {
					return next;
				});
			}

			for (let i = 0; i < promises.length; i++) {
				let p = getValidatedPromise(promises[i], i);

				if (promise === null) {
					promise = p;
				} else {
					promise = wrapPromise(promise, p);
				}
			}

			promise
				.then(() => {
					done();
				});
		});
	});

	describe('and failing tasks are scheduled', () => {
		let spies;
		let promises;
		let error;

		let start;

		beforeEach(() => {
			start = new Date();

			spies = [ ];
			promises = [ ];

			error = new Error('oops');

			const createSpy = () => {
				return jasmine.createSpy('spy').and.callFake(() => {
					throw error;
				});
			};

			for (let i = 0; i < 2; i++) {
				let spy = createSpy();

				spies.push(spy);

				promises.push(limiter.enqueue(spy));
			}
		});

		it('each task should be executed', (done) => {
			let promise = null;

			let getValidatedPromise = (promise, index) => {
				return promise.catch((error) => {
					let end = new Date();
					let duration = end.getTime() - start.getTime();

					let shortestPossibleDuration = Math.floor(index / windowMaximumCount) * windowDurationMilliseconds;

					expect(duration + 1).not.toBeLessThan(shortestPossibleDuration);
					expect(error).toBe(error);
				});
			};

			function wrapPromise(existing, next) {
				return existing.then(() => {
					return next;
				});
			}

			for (let i = 0; i < promises.length; i++) {
				let p = getValidatedPromise(promises[i], i);

				if (promise === null) {
					promise = p;
				} else {
					promise = wrapPromise(promise, p);
				}
			}

			promise
				.then(() => {
					done();
				});
		});
	});
});

describe('When a RateLimiter is constructed (2 execution per 25 milliseconds)', () => {
	'use strict';

	let limiter;

	let windowMaximumCount;
	let windowDurationMilliseconds;
	let concurrency;

	beforeEach(() => {
		limiter = new RateLimiter(windowMaximumCount = 2, windowDurationMilliseconds = 25, concurrency = null);
	});

	describe('and tasks are scheduled', () => {
		let spies;
		let promises;

		let start;

		beforeEach(() => {
			start = new Date();

			spies = [ ];
			promises = [ ];

			for (let i = 0; i < 10; i++) {
				let spy = jasmine.createSpy('spy');

				spies.push(spy);

				promises.push(limiter.enqueue(spy));
			}
		});

		it('the tasks not finish before the earliest possible moment', (done) => {
			let promise = null;

			let getValidatedPromise = (promise, index) => {
				return promise.then(() => {
					let end = new Date();
					let duration = end.getTime() - start.getTime();

					let shortestPossibleDuration = Math.floor(index / windowMaximumCount) * windowDurationMilliseconds;

					expect(duration + 1).not.toBeLessThan(shortestPossibleDuration);
				});
			};

			function wrapPromise(existing, next) {
				return existing.then(() => {
					return next;
				});
			}

			for (let i = 0; i < promises.length; i++) {
				let p = getValidatedPromise(promises[i], i);

				if (promise === null) {
					promise = p;
				} else {
					promise = wrapPromise(promise, p);
				}
			}

			promise
				.then(() => {
					done();
				});
		});
	});
});