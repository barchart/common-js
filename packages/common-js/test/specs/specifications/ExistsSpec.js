const Exists = require('./../../../specifications/Exists');

describe('When a Exists specification is constructed', () => {
	'use strict';

	let specification;

	beforeEach(() => {
		specification = new Exists();
	});

	it('should not pass a null value', () => {
		expect(specification.evaluate(null)).toEqual(false);
	});

	it('should not pass an implicit undefined value', () => {
		expect(specification.evaluate()).toEqual(false);
	});

	it('should not pass an explicit undefined value', () => {
		expect(specification.evaluate(undefined)).toEqual(false);
	});

	it('should pass a zero value', () => {
		expect(specification.evaluate(0)).toEqual(true);
	});

	it('should pass an empty-length string value', () => {
		expect(specification.evaluate('')).toEqual(true);
	});

	it('should pass an object value', () => {
		expect(specification.evaluate({ })).toEqual(true);
	});
});