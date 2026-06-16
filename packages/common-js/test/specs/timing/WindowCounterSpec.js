import WindowCounter from './../../../timing/WindowCounter.js';

describe('When a WindowCounter is constructed', () => {
	'use strict';

	let duration;
	let windows;

	let counter;

	beforeEach(() => {
		jasmine.clock().install();
		jasmine.clock().mockDate(new Date(2020, 0, 1));
	});

	afterEach(() => {
		jasmine.clock().uninstall();
	});

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

				beforeEach((done) => {
					setTimeout(() => {
						counter.increment(b = 3);

						done();
					}, duration + duration / 2);

					jasmine.clock().tick(duration + duration / 2);
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
