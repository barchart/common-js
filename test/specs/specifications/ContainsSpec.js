var Contains = require('./../../../specifications/Contains');

describe('When a Contains is constructed', function() {
	'use strict';

	var specification;
	var specificationValue;

	beforeEach(function() {
		specification = new Contains(specificationValue = 'xyz');
	});

	describe('and an array, containing the desired value, is evaluated', function() {
		var result;

		beforeEach(function() {
			result = specification.evaluate(['abc', 'def', specificationValue, 1, 2, 3]);
		});

		it('should pass', function() {
			expect(result).toEqual(true);
		});
	});

	describe('and an array, missing the desired value, is evaluated', function() {
		var result;

		beforeEach(function() {
			result = specification.evaluate(['abc', 'def', 1, 2, 3]);
		});

		it('should fail', function() {
			expect(result).toEqual(false);
		});
	});

	describe('and an object is evaluated', function() {
		var result;

		beforeEach(function() {
			result = specification.evaluate({ abc: 'xyz', xyz: 'abc' });
		});

		it('should fail', function() {
			expect(result).toEqual(false);
		});
	});
});