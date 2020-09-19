const Day = require('./../../../../lang/Day');

const DaySpecification = require('./../../../../specifications/compound/Day');

describe('When evaluating a compound Day specification', () => {
	'use strict';

	let specification;

	beforeEach(() => {
		specification = new DaySpecification();
	});

	it('should not pass when passed something other than an array', () => {
		expect(specification.evaluate(Day.getToday())).toBe(false);
	});

	it('should pass when passed an array where both items are Day instances', () => {
		expect(specification.evaluate([ Day.getToday(), Day.getToday() ])).toBe(true);
	});

	it('should not pass when passed an array where the first item is not a Day instance', () => {
		expect(specification.evaluate([ '2020-09-19', Day.getToday() ])).toBe(false);
	});

	it('should not pass when passed an array where the second item is not a Day instance', () => {
		expect(specification.evaluate([ Day.getToday(), '2020-09-19' ])).toBe(false);
	});

	it('should not pass when passed an array where neither item is a Day instance', () => {
		expect(specification.evaluate([ '2020-09-19', 123456789 ])).toBe(false);
	});
});