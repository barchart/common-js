const GreaterThan = require('./../../../../specifications/compound/GreaterThan');

describe('When evaluating a compound GreaterThan specification', () => {
	'use strict';

	let specification;

	beforeEach(() => {
		specification = new GreaterThan();
	});

	it('should pass when the first item is larger than the second item', () => {
		expect(specification.evaluate([ 2, 1 ])).toBe(true);
	});

	it('should not pass when the first item is smaller than the second item', () => {
		expect(specification.evaluate([ 1, 2 ])).toBe(false);
	});

	it('should not pass when the first and second items are equal', () => {
		expect(specification.evaluate([ 1, 1 ])).toBe(false);
	});
});