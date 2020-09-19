const Contained = require('./../../../specifications/Contained');

describe('When a Contained specifciation is constructed', () => {
	'use strict';

	let specification;
	let specificationValue;

	beforeEach(() => {
		specification = new Contained(specificationValue = [ 'xyz', 123 ]);
	});

	describe('and a string, contained in the array, is evaluated', () => {
		let result;

		beforeEach(() => {
			result = specification.evaluate('xyz');
		});

		it('should pass', () => {
			expect(result).toEqual(true);
		});
	});

	describe('and a string, not contained in the array, is evaluated', () => {
		let result;

		beforeEach(() => {
			result = specification.evaluate('abc');
		});

		it('should not pass', () => {
			expect(result).toEqual(false);
		});
	});

	describe('and a number, contained in the array, is evaluated', () => {
		let result;

		beforeEach(() => {
			result = specification.evaluate(123);
		});

		it('should pass', () => {
			expect(result).toEqual(true);
		});
	});

	describe('and a number, not contained in the array, is evaluated', () => {
		let result;

		beforeEach(() => {
			result = specification.evaluate(1);
		});

		it('should not pass', () => {
			expect(result).toEqual(false);
		});
	});
});