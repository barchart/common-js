var WindowCounter = require('./../../../timing/WindowCounter');

describe('When a WindowCounter is constructed', function() {
	'use strict';

	var duration;
	var windows;

	var counter;

	beforeEach(function() {
		counter = new WindowCounter(duration = 15, windows = 100);
	});

	describe('and the counter is immediately incremented', function() {
		var a;

		beforeEach(function() {
			counter.increment(a = 42);
		});

		it('the current count should be the amount added', function() {
			expect(counter.getCurrent()).toEqual(a);
		});

		describe('and the counter is immediately incremented, again', function() {
			var b;

			beforeEach(function() {
				counter.increment(b = 99);
			});

			it('the current count should be the sum of the amounts added', function() {
				expect(counter.getCurrent()).toEqual(a + b);
			});
		});

		describe('and the counter is incremented after the current window expires', function() {
			var b;

			beforeEach(function(done) {
				setTimeout(function() {
					counter.increment(b = 3);

					done();
				}, duration + duration / 2);
			});

			it('the previous count should be the sum of the previous window', function() {
				expect(counter.getPrevious()).toEqual(a);
			});

			it('the current count should be the amount added', function() {
				expect(counter.getCurrent()).toEqual(b);
			});

			it('the average count should be the sum of the previous window', function() {
				expect(counter.getAverage()).toEqual(a);
			});
		});
	});
});