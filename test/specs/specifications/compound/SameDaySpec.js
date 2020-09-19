const Day = require('./../../../../lang/Day');

const SameDay = require('./../../../../specifications/compound/SameDay');

describe('When evaluating a compound SameDay specification', () => {
	'use strict';

	let specification;

	beforeEach(() => {
		specification = new SameDay();
	});

	it('should not pass when the first item is after than the second item', () => {
		expect(specification.evaluate([ Day.getToday(), Day.getToday().subtractDays(1) ])).toBe(false);
	});

	it('should not pass when the first item is before than the second item', () => {
		expect(specification.evaluate([ Day.getToday(), Day.getToday().addDays(1) ])).toBe(false);
	});

	it('should pass when the first and second items the same', () => {
		expect(specification.evaluate([ Day.getToday(), Day.getToday() ])).toBe(true);
	});
});