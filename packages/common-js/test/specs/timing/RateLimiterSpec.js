import RateLimiter from './../../../timing/RateLimiter.js';

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

		it('the tasks should serialized', async () => {
			for (let i = 0; i < promises.length; i++) {
				await promises[i];

				for (let j = 0; j < spies.length; j++) {
					let count;

					if (j > i) {
						count = 0;
					} else {
						count = 1;
					}

					expect(spies[j].calls.count()).toEqual(count);
				}
			}
		});

		it('the tasks not finish before the earliest possible moment', async () => {
			for (let i = 0; i < promises.length; i++) {
				await promises[i];

				let end = new Date();
				let duration = end.getTime() - start.getTime();

				let shortestPossibleDuration = Math.floor(i / windowMaximumCount) * windowDurationMilliseconds;

				expect(duration + 1).not.toBeLessThan(shortestPossibleDuration);
			}
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

		it('each task should be executed with correct timing', async () => {
			for (let i = 0; i < promises.length; i++) {
				try {
					await promises[i];
				} catch (e) {
					let end = new Date();
					let duration = end.getTime() - start.getTime();

					let shortestPossibleDuration = Math.floor(i / windowMaximumCount) * windowDurationMilliseconds;

					expect(duration + 1).not.toBeLessThan(shortestPossibleDuration);
				}
			}
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

		it('the tasks not finish before the earliest possible moment', async () => {
			for (let i = 0; i < promises.length; i++) {
				await promises[i];

				let end = new Date();
				let duration = end.getTime() - start.getTime();

				let shortestPossibleDuration = Math.floor(i / windowMaximumCount) * windowDurationMilliseconds;

				expect(duration + 1).not.toBeLessThan(shortestPossibleDuration);
			}
		});
	});
});
