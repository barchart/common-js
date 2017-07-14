var Scheduler = require('./../../../timing/Scheduler');

describe('When a Scheduler is constructed', function() {
	'use strict';

	var scheduler;

	beforeEach(function() {
		scheduler = new Scheduler();
	});

	describe('and task is scheduled', function() {
		var spy;
		var milliseconds;
		var promise;

		beforeEach(function() {
			promise = scheduler.schedule(spy = jasmine.createSpy('spy'), milliseconds = 10, 'A scheduled task');
		});

		it('should not execute the task synchronously', function() {
			expect(spy).not.toHaveBeenCalled();
		});

		it('should execute the task asynchronously', function(done) {
			promise
				.then(function() {
					expect(spy.calls.count()).toEqual(1);
				})
				.then(function() {
					done();
				});
		});
	});

	describe('and is disposed', function() {
		beforeEach(function() {
			scheduler.dispose();
		});

		it('and a task is scheduled', function() {
			var spy;
			var success;

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

			it('should reject the promise', function() {
				expect(success).toEqual(false);
			});

			it('should not invoke the underlying task', function() {
				expect(spy).not.toHaveBeenCalled();
			});
		});
	});
});

describe('When a backoff is used', function() {
	'use strict';

	var scheduler;

	beforeEach(function() {
		scheduler = new Scheduler();
	});

	describe('that succeeds immediately', function() {
		var spyAction;
		var spyFailure;

		var actualResult;
		var successfulResult;

		beforeEach(function(done) {
			spyAction = jasmine.createSpy('spyAction').and.callFake(function () {
				return successfulResult = 'ok computer';
			});

			spyFailure = jasmine.createSpy('spyFailure');

			scheduler.backoff(spyAction, 5, 'succeeds immediately', 1, spyFailure)
				.then(function(r) {
					actualResult = r;

					done();
				});
		});

		it('should call the "backoff" action one time', function() {
			expect(spyAction.calls.count()).toEqual(1);
		});

		it('the promise result should match the expected result', function() {
			expect(actualResult).toEqual(successfulResult);
		});

		it('should never call the "failure" action', function() {
			expect(spyFailure.calls.count()).toEqual(0);
		});
	});

	describe('that fails once before succeeding (by throwing error)', function() {
		var spyAction;
		var spyFailure;

		var actualResult;
		var successfulResult;

		var x;

		beforeEach(function(done) {
			x = 0;

			spyAction = jasmine.createSpy('spyAction').and.callFake(function () {
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

		it('should call the "backoff" action two times', function() {
			expect(spyAction.calls.count()).toEqual(2);
		});

		it('the promise result should match the expected result', function() {
			expect(actualResult).toEqual(successfulResult);
		});

		it('the "failure" action should be called once', function() {
			expect(spyFailure.calls.count()).toEqual(1);
		});
	});

	describe('that fails twice before succeeding (by returning a specific "failure" value)', function() {
		var spyAction;
		var spyFailure;

		var actualResult;
		var successfulResult;

		var x;

		beforeEach(function(done) {
			x = 0;

			spyAction = jasmine.createSpy('spyAction').and.callFake(function () {
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

		it('should call the "backoff" action three times', function() {
			expect(spyAction.calls.count()).toEqual(3);
		});

		it('the promise result should match the expected result', function() {
			expect(actualResult).toEqual(successfulResult);
		});

		it('the "failure" action should be called twice', function() {
			expect(spyFailure.calls.count()).toEqual(2);
		});
	});

	describe('final failure is declared after four attempts', function() {
		var spyAction;
		var spyFailure;

		var actualResult;
		var successfulResult;

		beforeEach(function(done) {
			spyAction = jasmine.createSpy('spyAction').and.callFake(function () {
				throw new Error('not gonna happen');
			});

			spyFailure = jasmine.createSpy('spyFailure');

			scheduler.backoff(spyAction, 5, 'succeeds immediately', 3, spyFailure, [ ])
				.catch(function(r) {
					actualResult = r;

					done();
				});
		});

		it('should call the "backoff" action four times', function() {
			expect(spyAction.calls.count()).toEqual(4);
		});

		it('the "failure" action should be called four times', function() {
			expect(spyFailure.calls.count()).toEqual(4);
		});
	});
});