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
				.finally(function() {
					done();
				});
		});
	});

	describe('and is disposed', function() {
		var spy;

		beforeEach(function() {
			spy = jasmine.createSpy('spy');

			scheduler.dispose();
		});

		it('should throw if an attempt is made to schedule a task', function() {
			expect(function() {
				scheduler.schedule(spy, 100, 'A scheduled task');
			}).toThrow(new Error('The Scheduler has been disposed.'));
		});
	});
});