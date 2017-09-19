var Day = require('./../../../lang/Day');

describe('When "2017-08-31 is parsed as a Day', function() {
	'use strict';

	var day;

	beforeEach(function() {
		day = Day.parse('2017-08-31');
	});

	it('the year should be 2017', function() {
		expect(day.year).toEqual(2017);
	});

	it('the month should be 8', function() {
		expect(day.month).toEqual(8);
	});

	it('the day should be 31', function() {
		expect(day.day).toEqual(31);
	});

	describe('and the Day instance is formatted', function() {
		it('should output "2017-08-31"', function() {
			expect(day.format()).toEqual('2017-08-31');
		});
	});
});

describe('When an invalid string is parsed as a Day', function() {
	function expectError(value) {
		expect(function() { Day.parse(value); }).toThrow();
	}

	it('an error should be thrown parsing a null value', function() {
		expectError(null);
	});

	it('an error should be thrown parsing a undefined value', function() {
		expectError(null);
	});

	it('an error should be thrown parsing a Date instance', function() {
		expectError(new Date());
	});

	it('an error should be thrown parsing an object', function() {
		expectError({ });
	});

	it('an error should be thrown parsing an number', function() {
		expectError((new Date()).getTime());
	});

	it('an should be thrown when using 13 months', function() {
		expectError('2017-13-01');
	});

	it('an should be thrown when using 32 days in January', function() {
		expectError('2017-01-32');
	});

	it('an should be thrown when using 30 days in February', function() {
		expectError('2017-02-30');
	});

	it('an should be thrown when using 32 days in March', function() {
		expectError('2017-03-32');
	});

	it('an should be thrown when using 31 days in April', function() {
		expectError('2017-04-31');
	});

	it('an should be thrown when using 32 days in May', function() {
		expectError('2017-05-32');
	});

	it('an should be thrown when using 31 days in June', function() {
		expectError('2017-06-31');
	});

	it('an should be thrown when using 32 days in July', function() {
		expectError('2017-07-32');
	});

	it('an should be thrown when using 32 days in August', function() {
		expectError('2017-08-32');
	});

	it('an should be thrown when using 31 days in September', function() {
		expectError('2017-02-31');
	});

	it('an should be thrown when using 32 days in October', function() {
		expectError('2017-10-32');
	});

	it('an should be thrown when using 31 days in November', function() {
		expectError('2017-11-31');
	});

	it('an should be thrown when using 32 days in December', function() {
		expectError('2017-12-32');
	});
});

describe('When checking to see if a Day is valid', function() {
	'use strict';

	it('should consider Jan 1, 2017 to be valid', function() {
		expect(Day.validate(2017, 1, 1)).toEqual(true);
	});

	it('should consider Dec 31, 2017 to be valid', function() {
		expect(Day.validate(2017, 12, 31)).toEqual(true);
	});

	it('should not consider Feb 29, 2017 to be valid', function() {
		expect(Day.validate(2017, 2, 29)).toEqual(false);
	});

	it('should not consider Feb 29, 2018 to be valid', function() {
		expect(Day.validate(2018, 2, 29)).toEqual(false);
	});

	it('should not consider Feb 29, 2019 to be valid', function() {
		expect(Day.validate(2019, 2, 29)).toEqual(false);
	});

	it('should consider Feb 29, 2020 to be valid', function() {
		expect(Day.validate(2020, 2, 29)).toEqual(true);
	});
});

describe('When adding days to a Day', function() {
	'use strict';

	it('should return January 2, 2017 when adding 1 day to January 1, 2017', function () {
		const now = new Day(2017, 1, 1);
		const then = now.addDays(1);

		expect(then.year).toEqual(2017);
		expect(then.month).toEqual(1);
		expect(then.day).toEqual(2);
	});

	it('should return March 1, 2017 when adding 1 day to Feb 28, 2017', function () {
		const now = new Day(2017, 2, 28);
		const then = now.addDays(1);

		expect(then.year).toEqual(2017);
		expect(then.month).toEqual(3);
		expect(then.day).toEqual(1);
	});

	it('should return Feb 29, 2020 when adding 1 day Feb 28, 2020', function () {
		const now = new Day(2020, 2, 28);
		const then = now.addDays(1);

		expect(then.year).toEqual(2020);
		expect(then.month).toEqual(2);
		expect(then.day).toEqual(29);
	});

	it('should return Aug 18, 2018 when adding 400 days to Jul 14, 2017', function () {
		const now = new Day(2017, 7, 14);
		const then = now.addDays(400);

		expect(then.year).toEqual(2018);
		expect(then.month).toEqual(8);
		expect(then.day).toEqual(18);
	});

	it('should return Aug 18, 2017 when subtracting 1 day from Aug 19, 2017 (using inverse)', function () {
		const now = new Day(2017, 8, 19);
		const then = now.subtractDays(1);

		expect(then.year).toEqual(2017);
		expect(then.month).toEqual(8);
		expect(then.day).toEqual(18);
	});

	it('should return Aug 18, 2017 when adding 1 "inverse" day to Aug 19, 2017', function () {
		const now = new Day(2017, 8, 19);
		const then = now.addDays(1, true);

		expect(then.year).toEqual(2017);
		expect(then.month).toEqual(8);
		expect(then.day).toEqual(18);
	});

	it('should return Aug 18, 2017 when adding -1 day to Aug 19, 2017', function () {
		const now = new Day(2017, 8, 19);
		const then = now.addDays(-1);

		expect(then.year).toEqual(2017);
		expect(then.month).toEqual(8);
		expect(then.day).toEqual(18);
	});

	it('should return Jul 30, 2017 when subtracting 2 days from Aug 1, 2017', function () {
		const now = new Day(2017, 8, 1);
		const then = now.addDays(2, true);

		expect(then.year).toEqual(2017);
		expect(then.month).toEqual(7);
		expect(then.day).toEqual(30);
	});

	it('should return Dec 31, 2017 when subtracting 2 days from Jan 10, 2018', function () {
		const now = new Day(2018, 1, 10);
		const then = now.addDays(10, true);

		expect(then.year).toEqual(2017);
		expect(then.month).toEqual(12);
		expect(then.day).toEqual(31);
	});

	it('should return Feb 29, 2020 when subtracting 1 day from Mar 1, 2020', function () {
		const now = new Day(2020, 3, 1);
		const then = now.addDays(1, true);

		expect(then.year).toEqual(2020);
		expect(then.month).toEqual(2);
		expect(then.day).toEqual(29);
	});

	it('should return Mar 1, 2020 when adding 0 days from Mar 1, 2020', function () {
		const now = new Day(2020, 3, 1);
		const then = now.addDays(0);

		expect(then.year).toEqual(2020);
		expect(then.month).toEqual(3);
		expect(then.day).toEqual(1);
	});
});

describe('When "1900-01-01 is parsed as a Day', function() {
	'use strict';

	var day;

	beforeEach(function() {
		day = Day.parse('1900-01-01');
	});

	it('the year should be 1900', function() {
		expect(day.year).toEqual(1900);
	});

	it('the month should be 1', function() {
		expect(day.month).toEqual(1);
	});

	it('the day should be 1', function() {
		expect(day.day).toEqual(1);
	});

	describe('and 41635 days are added', function() {
		var future;

		beforeEach(function() {
			future = day.addDays(41635);
		});

		it('the year should be 2013', function() {
			expect(future.year).toEqual(2013);
		});

		it('the month should be 12', function() {
			expect(future.month).toEqual(12);
		});

		it('the day should be 29', function() {
			expect(future.day).toEqual(29);
		});
	});
});

describe('When comparing days', function() {
	it('The day "2017-07-18" should be before "2017-07-19"', function() {
		expect(Day.parse('2017-07-18').getIsBefore(Day.parse('2017-07-19'))).toEqual(true);
	});

	it('The day "2017-07-18" should be before "2017-08-18"', function() {
		expect(Day.parse('2017-07-18').getIsBefore(Day.parse('2017-08-18'))).toEqual(true);
	});

	it('The day "2017-07-18" should be before "2018-07-18"', function() {
		expect(Day.parse('2017-07-18').getIsBefore(Day.parse('2018-07-18'))).toEqual(true);
	});

	it('The day "2017-07-18" should not be after "2017-07-19"', function() {
		expect(Day.parse('2017-07-18').getIsAfter(Day.parse('2017-07-19'))).toEqual(false);
	});

	it('The day "2017-07-18" should not be after "2017-08-18"', function() {
		expect(Day.parse('2017-07-18').getIsAfter(Day.parse('2017-08-18'))).toEqual(false);
	});

	it('The day "2017-07-18" should bit be afte "2018-07-18"', function() {
		expect(Day.parse('2017-07-18').getIsAfter(Day.parse('2018-07-18'))).toEqual(false);
	});

	it('The day "2017-07-18" should not be before "2017-07-17"', function() {
		expect(Day.parse('2017-07-18').getIsBefore(Day.parse('2017-07-17'))).toEqual(false);
	});

	it('The day "2017-07-18" should not be before "2017-06-18"', function() {
		expect(Day.parse('2017-07-18').getIsBefore(Day.parse('2017-06-18'))).toEqual(false);
	});

	it('The day "2017-07-18" should not be before "2016-07-18"', function() {
		expect(Day.parse('2017-07-18').getIsBefore(Day.parse('2016-07-18'))).toEqual(false);
	});

	it('The day "2017-07-18" should be after "2017-07-17"', function() {
		expect(Day.parse('2017-07-18').getIsAfter(Day.parse('2017-07-17'))).toEqual(true);
	});

	it('The day "2017-07-18" should be after "2017-06-18"', function() {
		expect(Day.parse('2017-07-18').getIsAfter(Day.parse('2017-06-18'))).toEqual(true);
	});

	it('The day "2017-07-18" should be after "2016-07-18"', function() {
		expect(Day.parse('2017-07-18').getIsAfter(Day.parse('2016-07-18'))).toEqual(true);
	});
});
