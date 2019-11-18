const Contains = require('./../../../specifications/Contains');

describe('When a Contains is constructed', () => {
	'use strict';

	let specification;
	let specificationValue;

	beforeEach(() => {
		specification = new Contains(specificationValue = 'xyz');
	});

	describe('and an array, containing the desired value, is evaluated', () => {
		let result;

		beforeEach(() => {
			result = specification.evaluate(['abc', 'def', specificationValue, 1, 2, 3]);
		});

		it('should pass', () => {
			expect(result).toEqual(true);
		});
	});

	describe('and an array, missing the desired value, is evaluated', () => {
		let result;

		beforeEach(() => {
			result = specification.evaluate(['abc', 'def', 1, 2, 3]);
		});

		it('should fail', () => {
			expect(result).toEqual(false);
		});
	});

	describe('and an object is evaluated', () => {
		let result;

		beforeEach(() => {
			result = specification.evaluate({ abc: 'xyz', xyz: 'abc' });
		});

		it('should fail', () => {
			expect(result).toEqual(false);
		});
	});
});