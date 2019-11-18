const Scheduler = require('./../../../timing/Scheduler');

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

		it('should execute the task asynchronously', function(done) {
			promise
				.then(() => {
					expect(spy.calls.count()).toEqual(1);
				})
				.then(() => {
					done();
				});
		});
	});

	describe('and is disposed', () => {
		beforeEach(() => {
			scheduler.dispose();
		});

		describe('and a task is scheduled', () => {
			let spy;
			let success;

			beforeEach(function(done) {
				scheduler.schedule(spy = jasmine.createSpy('spy'), 10, 'A scheduled task')
					.then(() => {
						success = true;
					}).catch(() => {
						success = false;
					}).then(() => {
						done();
					});
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

		beforeEach(function(done) {
			spyAction = jasmine.createSpy('spyAction').and.callFake(() => {
				return successfulResult = 'ok computer';
			});

			spyFailure = jasmine.createSpy('spyFailure');

			scheduler.backoff(spyAction, 5, 'succeeds immediately', 1, spyFailure)
				.then(function(r) {
					actualResult = r;

					done();
				});
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

		beforeEach(function(done) {
			x = 0;

			spyAction = jasmine.createSpy('spyAction').and.callFake(() => {
				if (++x > 1) {
					return successfulResult = 'ok computer';
				} else {
					throw new Error('nope...');
				}
			});

			spyFailure = jasmine.createSpy('spyFailure');

			scheduler.backoff(spyAction, 5, 'succeeds immediately', 5, spyFailure)
				.then(function(r) {
					actualResult = r;

					done();
				});
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

		beforeEach(function(done) {
			x = 0;

			spyAction = jasmine.createSpy('spyAction').and.callFake(() => {
				if (++x > 2) {
					return successfulResult = [ 'ok computer' ];
				} else {
					return [ ];
				}
			});

			spyFailure = jasmine.createSpy('spyFailure');

			scheduler.backoff(spyAction, 5, 'succeeds immediately', 5, spyFailure, [ ])
				.then(function(r) {
					actualResult = r;

					done();
				});
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

		beforeEach(function(done) {
			spyAction = jasmine.createSpy('spyAction').and.callFake(() => {
				throw new Error('not gonna happen');
			});

			spyFailure = jasmine.createSpy('spyFailure');

			scheduler.backoff(spyAction, 5, 'succeeds immediately', 3, spyFailure, [ ])
				.catch(function(r) {
					actualResult = r;

					done();
				});
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

		beforeEach(function(done) {
			spyAction = jasmine.createSpy('spyAction').and.callFake(() => {
				return 'boom';
			});

			spyFailure = jasmine.createSpy('spyFailure');

			scheduler.backoff(spyAction, 5, 'detonate', 3, spyFailure, 'boom')
				.catch(function(r) {
					actualResult = r;

					done();
				});
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
});