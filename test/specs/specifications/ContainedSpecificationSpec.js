var ContainedSpecification = require('./../../../specifications/ContainedSpecification');

describe('When a ContainedSpecification is constructed', function() {
	'use strict';

	var specification;
	var specificationValue;

	beforeEach(function() {
		specification = new ContainedSpecification(specificationValue = [ 'xyz', 123 ]);
	});

	describe('and a string, contained in the array, is evaluated', function() {
		var result;

		beforeEach(function() {
			result = specification.evaluate('xyz');
		});

		it('should pass', function() {
			expect(result).toEqual(true);
		});
	});

	describe('and a string, not contained in the array, is evaluated', function() {
		var result;

		beforeEach(function() {
			result = specification.evaluate('abc');
		});

		it('should not pass', function() {
			expect(result).toEqual(false);
		});
	});

	describe('and a number, contained in the array, is evaluated', function() {
		var result;

		beforeEach(function() {
			result = specification.evaluate(123);
		});

		it('should pass', function() {
			expect(result).toEqual(true);
		});
	});

	describe('and a number, not contained in the array, is evaluated', function() {
		var result;

		beforeEach(function() {
			result = specification.evaluate(1);
		});

		it('should not pass', function() {
			expect(result).toEqual(false);
		});
	});
});