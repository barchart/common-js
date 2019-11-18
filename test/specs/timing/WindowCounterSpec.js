const WindowCounter = require('./../../../timing/WindowCounter');

describe('When a WindowCounter is constructed', () => {
	'use strict';

	let duration;
	let windows;

	let counter;

	beforeEach(() => {
		counter = new WindowCounter(duration = 15, windows = 100);
	});

	describe('and the counter is immediately incremented', () => {
		let a;

		beforeEach(() => {
			counter.increment(a = 42);
		});

		it('the current count should be the amount added', () => {
			expect(counter.getCurrent()).toEqual(a);
		});

		describe('and the counter is immediately incremented, again', () => {
			let b;

			beforeEach(() => {
				counter.increment(b = 99);
			});

			it('the current count should be the sum of the amounts added', () => {
				expect(counter.getCurrent()).toEqual(a + b);
			});
		});

		describe('and the counter is incremented after the current window expires', () => {
			let b;

			beforeEach(function(done) {
				setTimeout(() => {
					counter.increment(b = 3);

					done();
				}, duration + duration / 2);
			});

			it('the previous count should be the sum of the previous window', () => {
				expect(counter.getPrevious()).toEqual(a);
			});

			it('the current count should be the amount added', () => {
				expect(counter.getCurrent()).toEqual(b);
			});

			it('the average count should be the sum of the previous window', () => {
				expect(counter.getAverage()).toEqual(a);
			});
		});
	});
});