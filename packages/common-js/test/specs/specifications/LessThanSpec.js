import LessThan from './../../../specifications/LessThan.js';

describe('When a LessThan specification is used', () => {
	'use strict';

	let specification;

	beforeEach(() => {
		specification = new LessThan(10);
	});

	it('should pass when data is less than the configured value', () => {
		expect(specification.evaluate(9)).toEqual(true);
	});

	it('should fail when data is equal to the configured value', () => {
		expect(specification.evaluate(10)).toEqual(false);
	});

	it('should fail when data is greater than the configured value', () => {
		expect(specification.evaluate(11)).toEqual(false);
	});

	it('should validate constructor arguments', () => {
		expect(() => new LessThan()).toThrow();
	});

	it('should validate evaluate arguments', () => {
		expect(() => specification.evaluate()).toThrow();
	});
});
