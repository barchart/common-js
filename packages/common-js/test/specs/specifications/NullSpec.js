const Null = require('./../../../specifications/Null');

describe('When a Null specification is constructed', () => {
	'use strict';

	let specification;

	beforeEach(() => {
		specification = new Null();
	});

	it('should pass a null value', () => {
		expect(specification.evaluate(null)).toEqual(true);
	});

	it('should not pass an implicit undefined value', () => {
		expect(specification.evaluate()).toEqual(false);
	});

	it('should not pass an explicit undefined value', () => {
		expect(specification.evaluate(undefined)).toEqual(false);
	});

	it('should not pass a zero value', () => {
		expect(specification.evaluate(0)).toEqual(false);
	});

	it('should not pass an empty-length string value', () => {
		expect(specification.evaluate('')).toEqual(false);
	});
});