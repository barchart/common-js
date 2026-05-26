const WithinSpecification = require('./../../../../specifications/compound/Within');

describe('When evaluating a compound Within specification (with a tolerance of 5)', () => {
	'use strict';

	let specification;
	let tolerance;

	beforeEach(() => {
		specification = new WithinSpecification(tolerance = 5);
	});

	it('should not pass when passed something other than an array', () => {
		expect(specification.evaluate()).toBe(false);
	});

	it('should pass when passed an array where the first item is -1 and the second item is 3', () => {
		expect(specification.evaluate([ -1, 3 ])).toBe(true);
	});

	it('should pass when passed an array where the first item is 3 and the second item is -1', () => {
		expect(specification.evaluate([ 3, -1 ])).toBe(true);
	});

	it('should pass when passed an array where the first item is -1 and the second item is 4', () => {
		expect(specification.evaluate([ -1, 4 ])).toBe(true);
	});

	it('should pass when passed an array where the first item is 4 and the second item is -1', () => {
		expect(specification.evaluate([ 4, -1 ])).toBe(true);
	});

	it('should not pass when passed an array where the first item is -1 and the second item is 5', () => {
		expect(specification.evaluate([ -1, 5 ])).toBe(false);
	});

	it('should not pass when passed an array where the first item is 5 and the second item is -1', () => {
		expect(specification.evaluate([ 5, -1 ])).toBe(false);
	});

	it('should pass when passed an array where the first item is 6 and the second item is 11', () => {
		expect(specification.evaluate([ 6, 11 ])).toBe(true);
	});

	it('should pass when passed an array where the first item is 11 and the second item is 6', () => {
		expect(specification.evaluate([ 11, 6 ])).toBe(true);
	});

	it('should pass when passed an array where the first item is 5 and the second item is 11', () => {
		expect(specification.evaluate([ 5, 11 ])).toBe(false);
	});

	it('should pass when passed an array where the first item is 11 and the second item is 5', () => {
		expect(specification.evaluate([ 11, 5 ])).toBe(false);
	});
});