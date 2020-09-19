const Numeric = require('./../../../specifications/Numeric');

describe('When a Numeric specification is constructed', () => {
	'use strict';

	let specification;

	beforeEach(() => {
		specification = new Numeric();
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

	describe('and a number value is evaluated', () => {
		let result;

		beforeEach(() => {
			result = specification.evaluate(0);
		});

		it('should pass', () => {
			expect(result).toEqual(true);
		});
	});
});