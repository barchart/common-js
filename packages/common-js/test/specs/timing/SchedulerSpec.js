import Disposable from './../../../lang/Disposable.js';
import Scheduler from './../../../timing/Scheduler.js';

describe('When a Scheduler is constructed', () => {
	'use strict';

	let scheduler;

	beforeEach(() => {
		scheduler = new Scheduler();
	});

	describe('and task is scheduled', () => {
		let spy;
		let milliseconds;
		let promise;

		beforeEach(() => {
			promise = scheduler.schedule(spy = jasmine.createSpy('spy'), milliseconds = 10, 'A scheduled task');
		});

		it('should not execute the task synchronously', () => {
			expect(spy).not.toHaveBeenCalled();
		});

		it('should execute the task asynchronously', async () => {
			await promise;

			expect(spy.calls.count()).toEqual(1);
		});
	});

	describe('and a task is repeated', () => {
		let binding;
		let spy;

		beforeEach(async () => {
			spy = jasmine.createSpy('spy');
			binding = scheduler.repeat(spy, 5, 'A repeated task');

			await new Promise(resolve => setTimeout(resolve, 15));

			binding.dispose();
		});

		it('should return a Disposable instance', () => {
			expect(binding instanceof Disposable).toEqual(true);
		});

		it('should execute the task repeatedly', () => {
			expect(spy.calls.count() > 0).toEqual(true);
		});
	});

	describe('and is disposed', () => {
		beforeEach(() => {
			scheduler.dispose();
		});

		describe('and a task is scheduled', () => {
			let spy;
			let success;

			beforeEach(async () => {
				try {
					await scheduler.schedule(spy = jasmine.createSpy('spy'), 10, 'A scheduled task');

					success = true;
				} catch (e) {
					success = false;
				}
			});

			it('should reject the promise', () => {
				expect(success).toEqual(false);
			});

			it('should not invoke the underlying task', () => {
				expect(spy).not.toHaveBeenCalled();
			});
		});
	});
});

describe('When a backoff is used', () => {
	'use strict';

	let scheduler;

	beforeEach(() => {
		scheduler = new Scheduler();
	});

	describe('that succeeds immediately', () => {
		let spyAction;
		let spyFailure;

		let actualResult;
		let successfulResult;

		beforeEach(async () => {
			spyAction = jasmine.createSpy('spyAction').and.callFake(() => {
				successfulResult = 'ok computer';

				return successfulResult;
			});

			spyFailure = jasmine.createSpy('spyFailure');

			actualResult = await scheduler.backoff(spyAction, 5, 'succeeds immediately', 1, spyFailure, undefined, 100);
		});

		it('should call the "backoff" action one time', () => {
			expect(spyAction.calls.count()).toEqual(1);
		});

		it('the promise result should match the expected result', () => {
			expect(actualResult).toEqual(successfulResult);
		});

		it('should never call the "failure" action', () => {
			expect(spyFailure.calls.count()).toEqual(0);
		});
	});

	describe('that fails once before succeeding (by throwing error)', () => {
		let spyAction;
		let spyFailure;

		let actualResult;
		let successfulResult;

		let x;

		beforeEach(async () => {
			x = 0;

			spyAction = jasmine.createSpy('spyAction').and.callFake(() => {
				if (++x > 1) {
					successfulResult = 'ok computer';

					return successfulResult;
				} else {
					throw new Error('nope...');
				}
			});

			spyFailure = jasmine.createSpy('spyFailure');

			actualResult = await scheduler.backoff(spyAction, 5, 'succeeds immediately', 5, spyFailure, undefined, 100);
		});

		it('should call the "backoff" action two times', () => {
			expect(spyAction.calls.count()).toEqual(2);
		});

		it('the promise result should match the expected result', () => {
			expect(actualResult).toEqual(successfulResult);
		});

		it('the "failure" action should be called once', () => {
			expect(spyFailure.calls.count()).toEqual(1);
		});
	});

	describe('that fails twice before succeeding (by returning a specific "failure" value)', () => {
		let spyAction;
		let spyFailure;

		let actualResult;
		let successfulResult;

		let x;

		beforeEach(async () => {
			x = 0;

			spyAction = jasmine.createSpy('spyAction').and.callFake(() => {
				if (++x > 2) {
					successfulResult = [ 'ok computer' ];

					return successfulResult;
				} else {
					return [ ];
				}
			});

			spyFailure = jasmine.createSpy('spyFailure');

			actualResult = await scheduler.backoff(spyAction, 5, 'succeeds immediately', 5, spyFailure, [ ], 100);
		});

		it('should call the "backoff" action three times', () => {
			expect(spyAction.calls.count()).toEqual(3);
		});

		it('the promise result should match the expected result', () => {
			expect(actualResult).toEqual(successfulResult);
		});

		it('the "failure" action should be called twice', () => {
			expect(spyFailure.calls.count()).toEqual(2);
		});
	});

	describe('final failure is declared after three attempts', () => {
		let spyAction;
		let spyFailure;

		let actualResult;

		beforeEach(async () => {
			spyAction = jasmine.createSpy('spyAction').and.callFake(() => {
				throw new Error('not gonna happen');
			});

			spyFailure = jasmine.createSpy('spyFailure');

			try {
				await scheduler.backoff(spyAction, 5, 'succeeds immediately', 3, spyFailure, [ ], 100);
			} catch (r) {
				actualResult = r;
			}
		});

		it('should call the "backoff" action three times', () => {
			expect(spyAction.calls.count()).toEqual(3);
		});

		it('the "failure" action should be called three times', () => {
			expect(spyFailure.calls.count()).toEqual(3);
		});

		it('the promise should be rejected (with an Error instance)', () => {
			expect(actualResult instanceof Error).toEqual(true);
		});
	});

	describe('final failure is declared after three attempts (using the "failureValue" argument)', () => {
		let spyAction;
		let spyFailure;

		let actualResult;

		beforeEach(async () => {
			spyAction = jasmine.createSpy('spyAction').and.callFake(() => {
				return 'boom';
			});

			spyFailure = jasmine.createSpy('spyFailure');

			try {
				await scheduler.backoff(spyAction, 5, 'detonate', 3, spyFailure, 'boom', 100);
			} catch (r) {
				actualResult = r;
			}
		});

		it('should call the "backoff" action three times', () => {
			expect(spyAction.calls.count()).toEqual(3);
		});

		it('the "failure" action should be called three times', () => {
			expect(spyFailure.calls.count()).toEqual(3);
		});

		it('the promise should be rejected', () => {
			expect(actualResult).toEqual('Maximum failures reached for detonate');
		});
	});

	describe('that respects the maximum delay', () => {
		let spyAction;
		let spyFailure;
		let delays;

		beforeEach(async () => {
			delays = [];
			spyAction = jasmine.createSpy('spyAction').and.callFake(() => {
				throw new Error('nope...');
			});

			spyFailure = jasmine.createSpy('spyFailure');

			spyOn(scheduler, 'schedule').and.callFake((action, delay) => {
				delays.push(delay);
				return action();
			});

			try {
				await scheduler.backoff(spyAction, 5, 'test max delay', 5, spyFailure, undefined, 20);
			} catch (e) {

			}
		});

		it('should not exceed the maximum delay', () => {
			expect(delays.every(delay => delay <= 20)).toBe(true);
		});
	});
});
