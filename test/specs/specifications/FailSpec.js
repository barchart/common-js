const Fail = require('./../../../specifications/Fail');

describe('When a Fail specification is constructed', () => {
	'use strict';

	let specification;
	let specificationValue;

	beforeEach(() => {
		specification = new Fail(specificationValue = 'ignored');
	});

	describe('and a string is evaluated', () => {
		let result;

		beforeEach(() => {
			result = specification.evaluate('abc');
		});

		it('should not pass', () => {
			expect(result).toEqual(false);
		});
	});

	describe('and a null value is evaluated', () => {
		let result;

		beforeEach(() => {
			result = specification.evaluate(null);
		});

		it('should not pass', () => {
			expect(result).toEqual(false);
		});
	});

	describe('and an undefined value is evaluated', () => {
		let result;

		beforeEach(() => {
			result = specification.evaluate(undefined);
		});

		it('should not pass', () => {
			expect(result).toEqual(false);
		});
	});
});