var Numeric = require('./../../../specifications/Numeric');

describe('When a Numeric is constructed', function() {
	'use strict';

	var specification;

	beforeEach(function() {
		specification = new Numeric();
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

	describe('and a number value is evaluated', function() {
		var result;

		beforeEach(function() {
			result = specification.evaluate(0);
		});

		it('should pass', function() {
			expect(result).toEqual(true);
		});
	});
});