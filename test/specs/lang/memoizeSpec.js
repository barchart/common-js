const memoize = require('./../../../lang/memoize');

describe('When using memoize.simple', () => {
	'use strict';

	describe("on a function that takes a tenth of second to complete", () => {
		let spy;
		let memo;

		let counter;

		beforeEach(() => {
			counter = 0;

			spy = jasmine.createSpy('spy').and.callFake(function(x) {
				counter = counter + 1;

				return counter;
			});

			memo = memoize.simple(spy);
		});

		it('the memoized function should not have been called', () => {
			expect(spy).not.toHaveBeenCalled();
		});

		describe("and the memoized function is called", () => {
			let paramOne;
			let resultOne;

			beforeEach(() => {
				resultOne = memo(paramOne = 'a');
			});

			it('the memoized function to have been called', () => {
				expect(spy.calls.count()).toEqual(1);
			});

			it('the memoized function to have been called with the correct parameters', () => {
				expect(spy).toHaveBeenCalledWith(paramOne);
			});

			it('the result should be a number', () => {
				expect(typeof resultOne).toEqual('number');
			});

			describe("and the memoized function is with the same value again", () => {
				let resultTwo;

				beforeEach(() => {
					resultTwo = memo(paramOne);
				});

				it('the memoized function not to have been called again', () => {
					expect(spy.calls.count()).toEqual(1);
				});

				it('the memoized function should have returned the cached value', () => {
					expect(resultTwo).toEqual(resultOne);
				});
			});

			describe("and the memoized function is called with another value", () => {
				let paramTwo;
				let resultTwo;

				beforeEach(() => {
					resultTwo = memo(paramTwo = 'b');
				});

				it('the memoized function to have been called', () => {
					expect(spy.calls.count()).toEqual(2);
				});

				it('the memoized function to have been called with the correct parameters', () => {
					expect(spy).toHaveBeenCalledWith(paramTwo);
				});

				it('the result should be a number', () => {
					expect(typeof resultTwo).toEqual('number');
				});
			});
		});
	});
});

describe('When using memoize.cache', () => {
	'use strict';

	describe("with a 10 millisecond cache duration", () => {
		let spy;
		let memo;

		let counter;

		beforeEach(() => {
			counter = 0;

			spy = jasmine.createSpy('spy').and.callFake(function(x) {
				counter = counter + 1;

				return counter;
			});

			memo = memoize.cache(spy, 10);
		});

		it('the memoized function should not have been called', () => {
			expect(spy).not.toHaveBeenCalled();
		});

		describe("and the memoized function is called", () => {
			let paramOne;
			let resultOne;

			beforeEach(() => {
				resultOne = memo();
			});

			it('the memoized function to have been called', () => {
				expect(spy.calls.count()).toEqual(1);
			});

			it('the result should be one', () => {
				expect(resultOne).toEqual(1);
			});

			describe("and the memoized function is with the same value again", () => {
				let resultTwo;

				beforeEach(() => {
					resultTwo = memo(paramOne);
				});

				it('the memoized function not to have been called again', () => {
					expect(spy.calls.count()).toEqual(1);
				});

				it('the memoized function should have returned the cached value', () => {
					expect(resultTwo).toEqual(1);
				});
			});

			describe("and the memoized function is called after the cache expires", () => {
				let resultThree;

				beforeEach(function (done) {
					setTimeout(() => {
						resultThree = memo();

						done();
					}, 15);
				});

				it('the memoized function to have been called again', () => {
					expect(spy.calls.count()).toEqual(2);
				});

				it('the result should be two', () => {
					expect(resultThree).toEqual(2);
				});
			});
		});
	});
});