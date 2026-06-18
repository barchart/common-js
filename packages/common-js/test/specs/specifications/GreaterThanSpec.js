import GreaterThan from './../../../specifications/GreaterThan.js';

describe('When a GreaterThan specification is used', () => {
	'use strict';

	let specification;

	beforeEach(() => {
		specification = new GreaterThan(10);
	});

	it('should pass when data is greater than the configured value', () => {
		expect(specification.evaluate(11)).toEqual(true);
	});

	it('should fail when data is equal to the configured value', () => {
		expect(specification.evaluate(10)).toEqual(false);
	});

	it('should fail when data is less than the configured value', () => {
		expect(specification.evaluate(9)).toEqual(false);
	});

	it('should validate constructor arguments', () => {
		expect(() => new GreaterThan()).toThrow();
	});

	it('should validate evaluate arguments', () => {
		expect(() => specification.evaluate()).toThrow();
	});

	it('should have the expected string representation', () => {
		expect(specification.toString()).toEqual('[GreaterThan]');
	});
});
