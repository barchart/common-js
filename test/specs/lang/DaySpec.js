const Day = require('./../../../lang/Day');

describe('When "2017-08-31 is parsed as a Day', () => {
	'use strict';

	let day;

	beforeEach(() => {
		day = Day.parse('2017-08-31');
	});

	it('the year should be 2017', () => {
		expect(day.year).toEqual(2017);
	});

	it('the month should be 8', () => {
		expect(day.month).toEqual(8);
	});

	it('the day should be 31', () => {
		expect(day.day).toEqual(31);
	});

	describe('and the Day instance is formatted', () => {
		it('should output "2017-08-31"', () => {
			expect(day.format()).toEqual('2017-08-31');
		});
	});
});

describe('When converting a Date (2017-11-16 at 17:40:01.002 local) to a Day', () => {
	'use strict';

	let date;
	let day;

	beforeEach(() => {
		day = Day.fromDate(date = new Date(2017, 10, 16, 17, 40, 1, 2));
	});

	it('the year should be 2017', () => {
		expect(day.year).toEqual(2017);
	});

	it('the month should be 11', () => {
		expect(day.month).toEqual(11);
	});

	it('the day should be 16', () => {
		expect(day.day).toEqual(16);
	});
});

describe('When converting a Date (2017-11-16 at 23:40:01.002 local) to a UTC Day', () => {
	'use strict';

	let date;
	let day;

	beforeEach(() => {
		day = Day.fromDateUtc(date = new Date(2017, 10, 16, 23, 40, 1, 2));
	});

	it('the year should be correct', () => {
		expect(day.year).toEqual(date.getUTCFullYear());
	});

	it('the month should be correct', () => {
		expect(day.month).toEqual(date.getUTCMonth() + 1);
	});

	it('the day should be correct', () => {
		expect(day.day).toEqual(date.getUTCDate());
	});
});

describe('When an invalid string is parsed as a Day', () => {
	function expectError(value) {
		expect(() => { Day.parse(value); }).toThrow();
	}

	it('an error should be thrown parsing a null value', () => {
		expectError(null);
	});

	it('an error should be thrown parsing a undefined value', () => {
		expectError(null);
	});

	it('an error should be thrown parsing a Date instance', () => {
		expectError(new Date());
	});

	it('an error should be thrown parsing an object', () => {
		expectError({ });
	});

	it('an error should be thrown parsing an number', () => {
		expectError((new Date()).getTime());
	});

	it('an should be thrown when using 13 months', () => {
		expectError('2017-13-01');
	});

	it('an should be thrown when using 32 days in January', () => {
		expectError('2017-01-32');
	});

	it('an should be thrown when using 30 days in February', () => {
		expectError('2017-02-30');
	});

	it('an should be thrown when using 32 days in March', () => {
		expectError('2017-03-32');
	});

	it('an should be thrown when using 31 days in April', () => {
		expectError('2017-04-31');
	});

	it('an should be thrown when using 32 days in May', () => {
		expectError('2017-05-32');
	});

	it('an should be thrown when using 31 days in June', () => {
		expectError('2017-06-31');
	});

	it('an should be thrown when using 32 days in July', () => {
		expectError('2017-07-32');
	});

	it('an should be thrown when using 32 days in August', () => {
		expectError('2017-08-32');
	});

	it('an should be thrown when using 31 days in September', () => {
		expectError('2017-02-31');
	});

	it('an should be thrown when using 32 days in October', () => {
		expectError('2017-10-32');
	});

	it('an should be thrown when using 31 days in November', () => {
		expectError('2017-11-31');
	});

	it('an should be thrown when using 32 days in December', () => {
		expectError('2017-12-32');
	});
});

describe('When checking to see if a Day is valid', () => {
	'use strict';

	it('should consider Jan 1, 2017 to be valid', () => {
		expect(Day.validate(2017, 1, 1)).toEqual(true);
	});

	it('should consider Dec 31, 2017 to be valid', () => {
		expect(Day.validate(2017, 12, 31)).toEqual(true);
	});

	it('should not consider Feb 29, 2017 to be valid', () => {
		expect(Day.validate(2017, 2, 29)).toEqual(false);
	});

	it('should not consider Feb 29, 2018 to be valid', () => {
		expect(Day.validate(2018, 2, 29)).toEqual(false);
	});

	it('should not consider Feb 29, 2019 to be valid', () => {
		expect(Day.validate(2019, 2, 29)).toEqual(false);
	});

	it('should consider Feb 29, 2020 to be valid', () => {
		expect(Day.validate(2020, 2, 29)).toEqual(true);
	});
});

describe('When adding (or subtracting) days to (or from) a Day', () => {
	'use strict';

	it('should return January 2, 2017 when adding 1 day to January 1, 2017', () => {
		const now = new Day(2017, 1, 1);
		const then = now.addDays(1);

		expect(then.year).toEqual(2017);
		expect(then.month).toEqual(1);
		expect(then.day).toEqual(2);
	});

	it('should return March 1, 2017 when adding 1 day to Feb 28, 2017', () => {
		const now = new Day(2017, 2, 28);
		const then = now.addDays(1);

		expect(then.year).toEqual(2017);
		expect(then.month).toEqual(3);
		expect(then.day).toEqual(1);
	});

	it('should return Feb 29, 2020 when adding 1 day Feb 28, 2020', () => {
		const now = new Day(2020, 2, 28);
		const then = now.addDays(1);

		expect(then.year).toEqual(2020);
		expect(then.month).toEqual(2);
		expect(then.day).toEqual(29);
	});

	it('should return Aug 18, 2018 when adding 400 days to Jul 14, 2017', () => {
		const now = new Day(2017, 7, 14);
		const then = now.addDays(400);

		expect(then.year).toEqual(2018);
		expect(then.month).toEqual(8);
		expect(then.day).toEqual(18);
	});

	it('should return Aug 18, 2017 when subtracting 1 day from Aug 19, 2017 (using inverse)', () => {
		const now = new Day(2017, 8, 19);
		const then = now.subtractDays(1);

		expect(then.year).toEqual(2017);
		expect(then.month).toEqual(8);
		expect(then.day).toEqual(18);
	});

	it('should return Aug 18, 2017 when adding 1 "inverse" day to Aug 19, 2017', () => {
		const now = new Day(2017, 8, 19);
		const then = now.addDays(1, true);

		expect(then.year).toEqual(2017);
		expect(then.month).toEqual(8);
		expect(then.day).toEqual(18);
	});

	it('should return Aug 18, 2017 when adding -1 day to Aug 19, 2017', () => {
		const now = new Day(2017, 8, 19);
		const then = now.addDays(-1);

		expect(then.year).toEqual(2017);
		expect(then.month).toEqual(8);
		expect(then.day).toEqual(18);
	});

	it('should return Jul 30, 2017 when subtracting 2 days from Aug 1, 2017', () => {
		const now = new Day(2017, 8, 1);
		const then = now.addDays(2, true);

		expect(then.year).toEqual(2017);
		expect(then.month).toEqual(7);
		expect(then.day).toEqual(30);
	});

	it('should return Dec 31, 2017 when subtracting 2 days from Jan 10, 2018', () => {
		const now = new Day(2018, 1, 10);
		const then = now.addDays(10, true);

		expect(then.year).toEqual(2017);
		expect(then.month).toEqual(12);
		expect(then.day).toEqual(31);
	});

	it('should return Feb 29, 2020 when subtracting 1 day from Mar 1, 2020', () => {
		const now = new Day(2020, 3, 1);
		const then = now.addDays(1, true);

		expect(then.year).toEqual(2020);
		expect(then.month).toEqual(2);
		expect(then.day).toEqual(29);
	});

	it('should return Mar 1, 2020 when adding 0 days from Mar 1, 2020', () => {
		const now = new Day(2020, 3, 1);
		const then = now.addDays(0);

		expect(then.year).toEqual(2020);
		expect(then.month).toEqual(3);
		expect(then.day).toEqual(1);
	});
});

describe('When adding (or subtracting) months to (or from) a Day', () => {
	'use strict';

	it('should return January 2, 2017 when adding 13 months to December 2, 2015', () => {
		const now = new Day(2015, 12, 2);
		const then = now.addMonths(13);

		expect(then.year).toEqual(2017);
		expect(then.month).toEqual(1);
		expect(then.day).toEqual(2);
	});

	it('should return December 2, 2015 when subtracting 13 months from January 2, 2017', () => {
		const now = new Day(2017, 1, 2);
		const then = now.subtractMonths(13);

		expect(then.year).toEqual(2015);
		expect(then.month).toEqual(12);
		expect(then.day).toEqual(2);
	});

	it('should return February 28, 2018 when adding a month to January 30, 2018', () => {
		const now = new Day(2018, 1, 30);
		const then = now.addMonths(1);

		expect(then.year).toEqual(2018);
		expect(then.month).toEqual(2);
		expect(then.day).toEqual(28);
	});

	it('should return February 28, 2018 when subtracting a month from March 29, 2018', () => {
		const now = new Day(2018, 3, 29);
		const then = now.subtractMonths(1);

		expect(then.year).toEqual(2018);
		expect(then.month).toEqual(2);
		expect(then.day).toEqual(28);
	});

	it('should return April 29, 2018 when adding a month to March 29, 2018', () => {
		const now = new Day(2018, 3, 29);
		const then = now.addMonths(1);

		expect(then.year).toEqual(2018);
		expect(then.month).toEqual(4);
		expect(then.day).toEqual(29);
	});
});

describe('When adding (or subtracting) years to (or from) a Day', () => {
	'use strict';

	it('should return January 2, 2017 when adding 3 years to January 2, 2014', () => {
		const now = new Day(2014, 1, 2);
		const then = now.addYears(3);

		expect(then.year).toEqual(2017);
		expect(then.month).toEqual(1);
		expect(then.day).toEqual(2);
	});

	it('should return January 2, 2014 when subtracting 3 years from January 2, 2017', () => {
		const now = new Day(2017, 1, 2);
		const then = now.subtractYears(3);

		expect(then.year).toEqual(2014);
		expect(then.month).toEqual(1);
		expect(then.day).toEqual(2);
	});

	it('should return February 29, 2020 when adding 4 years to February 29, 2016', () => {
		const now = new Day(2016, 2, 29);
		const then = now.addYears(4);

		expect(then.year).toEqual(2020);
		expect(then.month).toEqual(2);
		expect(then.day).toEqual(29);
	});

	it('should return February 29, 2016 when subtracting 4 years from February 29, 2020', () => {
		const now = new Day(2020, 2, 29);
		const then = now.subtractYears(4);

		expect(then.year).toEqual(2016);
		expect(then.month).toEqual(2);
		expect(then.day).toEqual(29);
	});

	it('should return February 28, 2019 when adding 3 years to February 29, 2016', () => {
		const now = new Day(2016, 2, 29);
		const then = now.addYears(3);

		expect(then.year).toEqual(2019);
		expect(then.month).toEqual(2);
		expect(then.day).toEqual(28);
	});

	it('should return February 28, 2016 when subtracting 3 years from February 28, 2019', () => {
		const now = new Day(2019, 2, 28);
		const then = now.subtractYears(3);

		expect(then.year).toEqual(2016);
		expect(then.month).toEqual(2);
		expect(then.day).toEqual(28);
	});

	it('should return February 28, 2019 when subtracting 1 years from February 29, 2020', () => {
		const now = new Day(2020, 2, 29);
		const then = now.subtractYears(1);

		expect(then.year).toEqual(2019);
		expect(then.month).toEqual(2);
		expect(then.day).toEqual(28);
	});
});

describe('When "1900-01-01 is parsed as a Day', () => {
	'use strict';

	let day;

	beforeEach(() => {
		day = Day.parse('1900-01-01');
	});

	it('the year should be 1900', () => {
		expect(day.year).toEqual(1900);
	});

	it('the month should be 1', () => {
		expect(day.month).toEqual(1);
	});

	it('the day should be 1', () => {
		expect(day.day).toEqual(1);
	});

	describe('and 41635 days are added', () => {
		let future;

		beforeEach(() => {
			future = day.addDays(41635);
		});

		it('the year should be 2013', () => {
			expect(future.year).toEqual(2013);
		});

		it('the month should be 12', () => {
			expect(future.month).toEqual(12);
		});

		it('the day should be 29', () => {
			expect(future.day).toEqual(29);
		});
	});
});

describe('When comparing days', () => {
	it('The day "2017-07-18" should be before "2017-07-19"', () => {
		expect(Day.parse('2017-07-18').getIsBefore(Day.parse('2017-07-19'))).toEqual(true);
	});

	it('The day "2017-07-18" should be before "2017-08-18"', () => {
		expect(Day.parse('2017-07-18').getIsBefore(Day.parse('2017-08-18'))).toEqual(true);
	});

	it('The day "2017-07-18" should be before "2018-07-18"', () => {
		expect(Day.parse('2017-07-18').getIsBefore(Day.parse('2018-07-18'))).toEqual(true);
	});

	it('The day "2017-07-18" should not be after "2017-07-19"', () => {
		expect(Day.parse('2017-07-18').getIsAfter(Day.parse('2017-07-19'))).toEqual(false);
	});

	it('The day "2017-07-18" should not be after "2017-08-18"', () => {
		expect(Day.parse('2017-07-18').getIsAfter(Day.parse('2017-08-18'))).toEqual(false);
	});

	it('The day "2017-07-18" should bit be after "2018-07-18"', () => {
		expect(Day.parse('2017-07-18').getIsAfter(Day.parse('2018-07-18'))).toEqual(false);
	});

	it('The day "2017-07-18" should not be before "2017-07-17"', () => {
		expect(Day.parse('2017-07-18').getIsBefore(Day.parse('2017-07-17'))).toEqual(false);
	});

	it('The day "2017-07-18" should not be before "2017-06-18"', () => {
		expect(Day.parse('2017-07-18').getIsBefore(Day.parse('2017-06-18'))).toEqual(false);
	});

	it('The day "2017-07-18" should not be before "2016-07-18"', () => {
		expect(Day.parse('2017-07-18').getIsBefore(Day.parse('2016-07-18'))).toEqual(false);
	});

	it('The day "2017-07-18" should be after "2017-07-17"', () => {
		expect(Day.parse('2017-07-18').getIsAfter(Day.parse('2017-07-17'))).toEqual(true);
	});

	it('The day "2017-07-18" should be after "2017-06-18"', () => {
		expect(Day.parse('2017-07-18').getIsAfter(Day.parse('2017-06-18'))).toEqual(true);
	});

	it('The day "2017-07-18" should be after "2016-07-18"', () => {
		expect(Day.parse('2017-07-18').getIsAfter(Day.parse('2016-07-18'))).toEqual(true);
	});
});

describe('When checking a days containment in a range of days', () => {
	let day;

	beforeEach(() => {
		day = new Day(2018, 3, 11);
	});

	it('should return true when the date is between the range boundaries', () => {
		expect(day.getIsContained(new Day(2018, 3, 10), new Day(2018, 3, 12))).toEqual(true);
	});

	it('should return true when the date is on the beginning boundary of the range', () => {
		expect(day.getIsContained(new Day(2018, 3, 11), new Day(2018, 3, 12))).toEqual(true);
	});

	it('should return true when the date is on the end boundary of the range', () => {
		expect(day.getIsContained(new Day(2018, 3, 10), new Day(2018, 3, 11))).toEqual(true);
	});

	it('should return true when no end boundary is specified, but the date is after the beginning boundary', () => {
		expect(day.getIsContained(new Day(2018, 3, 10))).toEqual(true);
	});

	it('should return true when no beginning boundary is specified, but the date is before the end boundary', () => {
		expect(day.getIsContained(null, new Day(2018, 3, 12))).toEqual(true);
	});

	it('should return true when no end boundary is specified, but the date is on the beginning boundary', () => {
		expect(day.getIsContained(new Day(2018, 3, 11))).toEqual(true);
	});

	it('should return true when no beginning boundary is specified, but the date is on the end boundary', () => {
		expect(day.getIsContained(null, new Day(2018, 3, 11))).toEqual(true);
	});

	it('should return false when the date is after range boundaries', () => {
		expect(day.getIsContained(new Day(2018, 3, 8), new Day(2018, 3, 10))).toEqual(false);
	});

	it('should return false when the date is after before boundaries', () => {
		expect(day.getIsContained(new Day(2018, 3, 12), new Day(2018, 3, 14))).toEqual(false);
	});

	it('should return false when no end boundary is specified, but the date is before the beginning boundary', () => {
		expect(day.getIsContained(new Day(2018, 3, 12))).toEqual(false);
	});

	it('should return false when no beginning boundary is specified, but the date is after the end boundary', () => {
		expect(day.getIsContained(null, new Day(2018, 3, 10))).toEqual(false);
	});

	it('should return false when the range is invalid', () => {
		expect(day.getIsContained(new Day(2018, 3, 12), new Day(2018, 3, 10))).toEqual(false);
	});
});

describe('When cloning a day', () => {
	let source;
	let clone;

	beforeEach(() => {
		source = new Day(2018, 3, 11);
		clone = Day.clone(source);
	});

	it('the cloned instance should not be the same as the source instance', () => {
		expect(clone).not.toBe(source);
	});

	it('the cloned year should be equal to the source year', () => {
		expect(clone.year).toEqual(source.year);
	});

	it('the cloned month should be equal to the source month', () => {
		expect(clone.year).toEqual(source.year);
	});

	it('the cloned day should be equal to the source day', () => {
		expect(clone.year).toEqual(source.year);
	});

	it('the cloned instance should equal the source instance', () => {
		expect(source.getIsEqual(clone)).toEqual(true);
	});
});

describe('When getting start of the month', () => {
	it('for 2018-02-28 should be 2018-02-01', () => {
		expect(new Day(2018, 2, 28).getStartOfMonth().getIsEqual(new Day(2018, 2, 1))).toEqual(true);
	});

	it('for 2018-03-30 should be 2018-03-01', () => {
		expect(new Day(2018, 3, 30).getStartOfMonth().getIsEqual(new Day(2018, 3, 1))).toEqual(true);
	});

	it('should not return the same object', () => {
		const d = new Day(2018, 2, 1);

		expect(d.getStartOfMonth()).not.toBe(d);
	});
});

describe('When getting end of the month', () => {
	it('for 2018-02-28 should be 2018-02-28', () => {
		expect(new Day(2018, 2, 28).getEndOfMonth().getIsEqual(new Day(2018, 2, 28))).toEqual(true);
	});

	it('for 2018-03-30 should be 2018-03-31', () => {
		expect(new Day(2018, 3, 30).getEndOfMonth().getIsEqual(new Day(2018, 3, 31))).toEqual(true);
	});

	it('should not return the same object', () => {
		const d = new Day(2018, 2, 28);

		expect(d.getEndOfMonth()).not.toBe(d);
	});
});