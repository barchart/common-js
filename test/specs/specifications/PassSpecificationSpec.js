var PassSpecification = require('./../../../specifications/PassSpecification');

describe('When a PassSpecification is constructed', function() {
	'use strict';

	var specification;
	var specificationValue;

	beforeEach(function() {
		specification = new PassSpecification(specificationValue = 'ignored');
	});

	describe('and a string is evaluated', function() {
		var result;

		beforeEach(function() {
			result = specification.evaluate('abc');
		});

		it('should pass', function() {
			expect(result).toEqual(true);
		});
	});

	describe('and a null value is evaluated', function() {
		var result;

		beforeEach(function() {
			result = specification.evaluate(null);
		});

		it('should pass', function() {
			expect(result).toEqual(true);
		});
	});

	describe('and an undefined value is evaluated', function() {
		var result;

		beforeEach(function() {
			result = specification.evaluate(undefined);
		});

		it('should pass', function() {
			expect(result).toEqual(true);
		});
	});
});