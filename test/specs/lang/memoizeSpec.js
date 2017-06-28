var memoize = require('./../../../lang/memoize');

describe('When using memoize.simple', function() {
	'use strict';

	describe("on a function that takes a tenth of second to complete", function() {
		var spy;
		var memo;

		var counter;

		beforeEach(function() {
			counter = 0;

			spy = jasmine.createSpy('spy').and.callFake(function(x) {
				counter = counter + 1;

				return counter;
			});

			memo = memoize.simple(spy);
		});

		it('the memoized function should not have been called', function() {
			expect(spy).not.toHaveBeenCalled();
		});

		describe("and the memoized function is called", function() {
			var paramOne;
			var resultOne;

			beforeEach(function() {
				resultOne = memo(paramOne = 'a');
			});

			it('the memoized function to have been called', function() {
				expect(spy.calls.count()).toEqual(1);
			});

			it('the memoized function to have been called with the correct parameters', function() {
				expect(spy).toHaveBeenCalledWith(paramOne);
			});

			it('the result should be a number', function() {
				expect(typeof resultOne).toEqual('number');
			});

			describe("and the memoized function is with the same value again", function() {
				var resultTwo;

				beforeEach(function() {
					resultTwo = memo(paramOne);
				});

				it('the memoized function not to have been called again', function() {
					expect(spy.calls.count()).toEqual(1);
				});

				it('the memoized function should have returned the cached value', function() {
					expect(resultTwo).toEqual(resultOne);
				});
			});

			describe("and the memoized function is called with another value", function() {
				var paramTwo;
				var resultTwo;

				beforeEach(function () {
					resultTwo = memo(paramTwo = 'b');
				});

				it('the memoized function to have been called', function () {
					expect(spy.calls.count()).toEqual(2);
				});

				it('the memoized function to have been called with the correct parameters', function () {
					expect(spy).toHaveBeenCalledWith(paramTwo);
				});

				it('the result should be a number', function () {
					expect(typeof resultTwo).toEqual('number');
				});
			});
		});
	});
});