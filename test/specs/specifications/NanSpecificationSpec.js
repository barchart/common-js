var NanSpecification = require('./../../../specifications/NanSpecification');

describe('When a NanSpecification is constructed', function() {
	'use strict';

	var specification;

	beforeEach(function() {
		specification = new NanSpecification();
	});

	describe('and a string is evaluated', function() {
		var result;

		beforeEach(function() {
			result = specification.evaluate('abc');
		});

		it('should not pass', function() {
			expect(result).toEqual(false);
		});
	});

	describe('and a null value is evaluated', function() {
		var result;

		beforeEach(function() {
			result = specification.evaluate(null);
		});

		it('should not pass', function() {
			expect(result).toEqual(false);
		});
	});

	describe('and an undefined value is evaluated', function() {
		var result;

		beforeEach(function() {
			result = specification.evaluate(undefined);
		});

		it('should not pass', function() {
			expect(result).toEqual(false);
		});
	});

	describe('and an integer value is evaluated', function() {
		var result;

		beforeEach(function() {
			result = specification.evaluate(1);
		});

		it('should not pass', function() {
			expect(result).toEqual(false);
		});
	});

	describe('and a NaN value is evaluated', function() {
		var result;

		beforeEach(function() {
			result = specification.evaluate(parseFloat(null));
		});

		it('should pass', function() {
			expect(result).toEqual(true);
		});
	});
});