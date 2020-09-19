const Nan = require('./../../../specifications/Nan');

describe('When a NaN specification is constructed', () => {
	'use strict';

	let specification;

	beforeEach(() => {
		specification = new Nan();
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

	describe('and an integer value is evaluated', () => {
		let result;

		beforeEach(() => {
			result = specification.evaluate(1);
		});

		it('should not pass', () => {
			expect(result).toEqual(false);
		});
	});

	describe('and a NaN value is evaluated', () => {
		let result;

		beforeEach(() => {
			result = specification.evaluate(parseFloat(null));
		});

		it('should pass', () => {
			expect(result).toEqual(true);
		});
	});
});