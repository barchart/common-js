const Equals = require('./../../../specifications/Equals');

describe('When a Equals is constructed', () => {
	'use strict';

	let specification;
	let value;

	beforeEach(() => {
		specification = new Equals(value = { });
	});

	describe('and the same object is evaluated', () => {
		let result;

		beforeEach(() => {
			result = specification.evaluate(value);
		});

		it('should pass', () => {
			expect(result).toEqual(true);
		});
	});

	describe('and a different same object is evaluated', () => {
		let result;

		beforeEach(() => {
			result = specification.evaluate({ });
		});

		it('should not pass', () => {
			expect(result).toEqual(false);
		});
	});
});