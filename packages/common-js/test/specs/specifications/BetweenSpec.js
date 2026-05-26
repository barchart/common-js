const Between = require('./../../../specifications/Between');

describe('When a Between specification is constructed (with a range of 17 to 42)', () => {
	'use strict';

	let specification;

	beforeEach(() => {
		specification = new Between([ 17, 42 ]);
	});

	it('should pass not pass when 16 is evaluated', () => {
		expect(specification.evaluate(16)).toBe(false);
	});

	it('should pass not pass when 17 is evaluated', () => {
		expect(specification.evaluate(17)).toBe(false);
	});

	it('should pass pass when 18 is evaluated', () => {
		expect(specification.evaluate(18)).toBe(true);
	});

	it('should pass pass when 41 is evaluated', () => {
		expect(specification.evaluate(41)).toBe(true);
	});

	it('should pass not pass when 42 is evaluated', () => {
		expect(specification.evaluate(42)).toBe(false);
	});

	it('should pass not pass when 43 is evaluated', () => {
		expect(specification.evaluate(43)).toBe(false);
	});
});