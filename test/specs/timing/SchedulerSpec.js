var log4js = require('log4js');
var Scheduler = require('./../../../timing/Scheduler');

describe('When a Scheduler is constructed', function() {
	'use strict';

	log4js.configure({ });

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

		it('should not create a memory leak', function(done) {
			var before = 0;

			for (var tb in scheduler._timeoutBindings) {
				before++;
			}

			expect(before).toEqual(1);

			promise
				.then(function() {
					var after = 0;

					for (var tb in scheduler._timeoutBindings) {
						after++;
					}

					expect(after).toEqual(0);
				}).then(function() {
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