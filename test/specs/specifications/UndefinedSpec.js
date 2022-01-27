const Undefined = require('./../../../specifications/Undefined');

describe('When a Undefined specification is constructed', () => {
	'use strict';

	let specification;

	beforeEach(() => {
		specification = new Undefined();
	});

	it('should not pass a null value', () => {
		expect(specification.evaluate(null)).toEqual(false);
	});

	it('should pass an implicit undefined value', () => {
		expect(specification.evaluate()).toEqual(true);
	});

	it('should pass an explicit undefined value', () => {
		expect(specification.evaluate(undefined)).toEqual(true);
	});


	it('should not pass a zero value', () => {
		expect(specification.evaluate(0)).toEqual(false);
	});

	it('should not pass an empty-length string value', () => {
		expect(specification.evaluate('')).toEqual(false);
	});
});