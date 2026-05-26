const Numeric = require('./../../../../specifications/compound/Numeric');

describe('When evaluating a compound Numeric specification', () => {
	'use strict';

	let specification;

	beforeEach(() => {
		specification = new Numeric();
	});

	it('should not pass when passed something other than an array', () => {
		expect(specification.evaluate(1)).toBe(false);
	});

	it('should pass when passed an array where both items are numbers', () => {
		expect(specification.evaluate([ 1, 2 ])).toBe(true);
	});

	it('should not pass when passed an array where the first item is not a number', () => {
		expect(specification.evaluate([ '1', 2 ])).toBe(false);
	});

	it('should not pass when passed an array where the second item is not a number', () => {
		expect(specification.evaluate([ 1, '2' ])).toBe(false);
	});

	it('should not pass when passed an array where neither item is a number', () => {
		expect(specification.evaluate([ '1', '2' ])).toBe(false);
	});
});