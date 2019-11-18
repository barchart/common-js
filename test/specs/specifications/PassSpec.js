const Pass = require('./../../../specifications/Pass');

describe('When a Pass is constructed', () => {
	'use strict';

	let specification;
	let specificationValue;

	beforeEach(() => {
		specification = new Pass(specificationValue = 'ignored');
	});

	describe('and a string is evaluated', () => {
		let result;

		beforeEach(() => {
			result = specification.evaluate('abc');
		});

		it('should pass', () => {
			expect(result).toEqual(true);
		});
	});

	describe('and a null value is evaluated', () => {
		let result;

		beforeEach(() => {
			result = specification.evaluate(null);
		});

		it('should pass', () => {
			expect(result).toEqual(true);
		});
	});

	describe('and an undefined value is evaluated', () => {
		let result;

		beforeEach(() => {
			result = specification.evaluate(undefined);
		});

		it('should pass', () => {
			expect(result).toEqual(true);
		});
	});
});