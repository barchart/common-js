var FailSpecification = require('./../../../specifications/FailSpecification');

describe('When a FailSpecification is constructed', function() {
	'use strict';

	var specification;
	var specificationValue;

	beforeEach(function() {
		specification = new FailSpecification(specificationValue = 'ignored');
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
});