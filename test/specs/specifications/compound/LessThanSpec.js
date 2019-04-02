const LessThan = require('./../../../../specifications/compound/LessThan');

describe('When a LessThan is constructed', () => {
	'use strict';

	let specification;

	beforeEach(() => {
		specification = new LessThan();
	});

	it('should pass when the first item is smaller than the second item', () => {
		expect(specification.evaluate([ 1, 2 ])).toBe(true);
	});

	it('should not pass when the first item is larger than the second item', () => {
		expect(specification.evaluate([ 2, 1 ])).toBe(false);
	});

	it('should not pass when the first and second items are equal', () => {
		expect(specification.evaluate([ 1, 1 ])).toBe(false);
	});
});