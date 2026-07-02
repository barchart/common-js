import Day from './../../../lang/Day.js';
import DayFormatType from './../../../lang/DayFormatType.js';

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
		it('should output be "2017-08-31"', () => {
			expect(day.format()).toEqual('2017-08-31');
		});
	});
});

describe('When "2017-08-31 is parsed as a Day (using DayFormatType.YYYY_MM_DD)', () => {
	'use strict';

	let day;

	beforeEach(() => {
		day = Day.parse('2017-08-31', DayFormatType.YYYY_MM_DD);
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
		it('should output be "2017-08-31"', () => {
			expect(day.format()).toEqual('2017-08-31');
		});
	});
});

describe('When "08-31-2017 is parsed as a Day (using DayFormatType.MM_DD_YYYY)', () => {
	'use strict';

	let day;

	beforeEach(() => {
		day = Day.parse('08-31-2017', DayFormatType.MM_DD_YYYY);
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
		it('should output be "2017-08-31"', () => {
			expect(day.format()).toEqual('2017-08-31');
		});
	});
});

describe('When "08-31-17 is parsed as a Day (using DayFormatType.MM_DD_YY)', () => {
	'use strict';

	let day;

	beforeEach(() => {
		day = Day.parse('08-31-17', DayFormatType.MM_DD_YY);
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
		it('should output be "2017-08-31"', () => {
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
	function parseDay(value) {
		return () => { Day.parse(value); };
	}

	it('an error should be thrown parsing a null value', () => {
		expect(parseDay(null)).toThrow();
	});

	it('an error should be thrown parsing a undefined value', () => {
		expect(parseDay(null)).toThrow();
	});

	it('an error should be thrown parsing a Date instance', () => {
		expect(parseDay(new Date())).toThrow();
	});

	it('an error should be thrown parsing an object', () => {
		expect(parseDay({ })).toThrow();
	});

	it('an error should be thrown parsing an number', () => {
		expect(parseDay((new Date()).getTime())).toThrow();
	});

	it('an should be thrown when using 13 months', () => {
		expect(parseDay('2017-13-01')).toThrow();
	});

	it('an should be thrown when using 32 days in January', () => {
		expect(parseDay('2017-01-32')).toThrow();
	});

	it('an should be thrown when using 30 days in February', () => {
		expect(parseDay('2017-02-30')).toThrow();
	});

	it('an should be thrown when using 32 days in March', () => {
		expect(parseDay('2017-03-32')).toThrow();
	});

	it('an should be thrown when using 31 days in April', () => {
		expect(parseDay('2017-04-31')).toThrow();
	});

	it('an should be thrown when using 32 days in May', () => {
		expect(parseDay('2017-05-32')).toThrow();
	});

	it('an should be thrown when using 31 days in June', () => {
		expect(parseDay('2017-06-31')).toThrow();
	});

	it('an should be thrown when using 32 days in July', () => {
		expect(parseDay('2017-07-32')).toThrow();
	});

	it('an should be thrown when using 32 days in August', () => {
		expect(parseDay('2017-08-32')).toThrow();
	});

	it('an should be thrown when using 31 days in September', () => {
		expect(parseDay('2017-02-31')).toThrow();
	});

	it('an should be thrown when using 32 days in October', () => {
		expect(parseDay('2017-10-32')).toThrow();
	});

	it('an should be thrown when using 31 days in November', () => {
		expect(parseDay('2017-11-31')).toThrow();
	});

	it('an should be thrown when using 32 days in December', () => {
		expect(parseDay('2017-12-32')).toThrow();
	});
});

describe('When checking to see if a Day is valid', () => {
	'use strict';

	it('getDaysInMonth should return the expected number of days', () => {
		expect({
			jan: Day.getDaysInMonth(2017, 1),
			febCommon: Day.getDaysInMonth(2017, 2),
			febLeap: Day.getDaysInMonth(2020, 2),
			apr: Day.getDaysInMonth(2017, 4)
		}).toEqual({
			jan: 31,
			febCommon: 28,
			febLeap: 29,
			apr: 30
		});
	});

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

	describe('when adding 1 day to January 1, 2017', () => {
		let then;

		beforeEach(() => {
			then = new Day(2017, 1, 1).addDays(1);
		});

		it('should return the correct year', () => {
			expect(then.year).toEqual(2017);
		});

		it('should return the correct month', () => {
			expect(then.month).toEqual(1);
		});

		it('should return the correct day', () => {
			expect(then.day).toEqual(2);
		});
	});

	describe('when adding 1 day to Feb 28, 2017', () => {
		let then;

		beforeEach(() => {
			then = new Day(2017, 2, 28).addDays(1);
		});

		it('should return the correct year', () => {
			expect(then.year).toEqual(2017);
		});

		it('should return the correct month', () => {
			expect(then.month).toEqual(3);
		});

		it('should return the correct day', () => {
			expect(then.day).toEqual(1);
		});
	});

	describe('when adding 1 day to Feb 28, 2020', () => {
		let then;

		beforeEach(() => {
			then = new Day(2020, 2, 28).addDays(1);
		});

		it('should return the correct year', () => {
			expect(then.year).toEqual(2020);
		});

		it('should return the correct month', () => {
			expect(then.month).toEqual(2);
		});

		it('should return the correct day', () => {
			expect(then.day).toEqual(29);
		});
	});

	describe('when adding 400 days to Jul 14, 2017', () => {
		let then;

		beforeEach(() => {
			then = new Day(2017, 7, 14).addDays(400);
		});

		it('should return the correct year', () => {
			expect(then.year).toEqual(2018);
		});

		it('should return the correct month', () => {
			expect(then.month).toEqual(8);
		});

		it('should return the correct day', () => {
			expect(then.day).toEqual(18);
		});
	});

	describe('when subtracting 1 day from Aug 19, 2017', () => {
		let then;

		beforeEach(() => {
			then = new Day(2017, 8, 19).subtractDays(1);
		});

		it('should return the correct year', () => {
			expect(then.year).toEqual(2017);
		});

		it('should return the correct month', () => {
			expect(then.month).toEqual(8);
		});

		it('should return the correct day', () => {
			expect(then.day).toEqual(18);
		});
	});

	describe('when adding 1 inverse day to Aug 19, 2017', () => {
		let then;

		beforeEach(() => {
			then = new Day(2017, 8, 19).addDays(1, true);
		});

		it('should return the correct year', () => {
			expect(then.year).toEqual(2017);
		});

		it('should return the correct month', () => {
			expect(then.month).toEqual(8);
		});

		it('should return the correct day', () => {
			expect(then.day).toEqual(18);
		});
	});

	describe('when adding -1 day to Aug 19, 2017', () => {
		let then;

		beforeEach(() => {
			then = new Day(2017, 8, 19).addDays(-1);
		});

		it('should return the correct year', () => {
			expect(then.year).toEqual(2017);
		});

		it('should return the correct month', () => {
			expect(then.month).toEqual(8);
		});

		it('should return the correct day', () => {
			expect(then.day).toEqual(18);
		});
	});

	describe('when subtracting 2 days from Aug 1, 2017', () => {
		let then;

		beforeEach(() => {
			then = new Day(2017, 8, 1).addDays(2, true);
		});

		it('should return the correct year', () => {
			expect(then.year).toEqual(2017);
		});

		it('should return the correct month', () => {
			expect(then.month).toEqual(7);
		});

		it('should return the correct day', () => {
			expect(then.day).toEqual(30);
		});
	});

	describe('when subtracting 10 days from Jan 10, 2018', () => {
		let then;

		beforeEach(() => {
			then = new Day(2018, 1, 10).addDays(10, true);
		});

		it('should return the correct year', () => {
			expect(then.year).toEqual(2017);
		});

		it('should return the correct month', () => {
			expect(then.month).toEqual(12);
		});

		it('should return the correct day', () => {
			expect(then.day).toEqual(31);
		});
	});

	describe('when subtracting 1 day from Mar 1, 2020', () => {
		let then;

		beforeEach(() => {
			then = new Day(2020, 3, 1).addDays(1, true);
		});

		it('should return the correct year', () => {
			expect(then.year).toEqual(2020);
		});

		it('should return the correct month', () => {
			expect(then.month).toEqual(2);
		});

		it('should return the correct day', () => {
			expect(then.day).toEqual(29);
		});
	});

	describe('when adding 0 days to Mar 1, 2020', () => {
		let then;

		beforeEach(() => {
			then = new Day(2020, 3, 1).addDays(0);
		});

		it('should return the correct year', () => {
			expect(then.year).toEqual(2020);
		});

		it('should return the correct month', () => {
			expect(then.month).toEqual(3);
		});

		it('should return the correct day', () => {
			expect(then.day).toEqual(1);
		});
	});
});

describe('When adding (or subtracting) months to (or from) a Day', () => {
	'use strict';

	describe('when adding 13 months to December 2, 2015', () => {
		let then;

		beforeEach(() => {
			then = new Day(2015, 12, 2).addMonths(13);
		});

		it('should return the correct year', () => {
			expect(then.year).toEqual(2017);
		});

		it('should return the correct month', () => {
			expect(then.month).toEqual(1);
		});

		it('should return the correct day', () => {
			expect(then.day).toEqual(2);
		});
	});

	describe('when subtracting 13 months from January 2, 2017', () => {
		let then;

		beforeEach(() => {
			then = new Day(2017, 1, 2).subtractMonths(13);
		});

		it('should return the correct year', () => {
			expect(then.year).toEqual(2015);
		});

		it('should return the correct month', () => {
			expect(then.month).toEqual(12);
		});

		it('should return the correct day', () => {
			expect(then.day).toEqual(2);
		});
	});

	describe('when adding a month to January 30, 2018', () => {
		let then;

		beforeEach(() => {
			then = new Day(2018, 1, 30).addMonths(1);
		});

		it('should return the correct year', () => {
			expect(then.year).toEqual(2018);
		});

		it('should return the correct month', () => {
			expect(then.month).toEqual(2);
		});

		it('should return the correct day', () => {
			expect(then.day).toEqual(28);
		});
	});

	describe('when subtracting a month from March 29, 2018', () => {
		let then;

		beforeEach(() => {
			then = new Day(2018, 3, 29).subtractMonths(1);
		});

		it('should return the correct year', () => {
			expect(then.year).toEqual(2018);
		});

		it('should return the correct month', () => {
			expect(then.month).toEqual(2);
		});

		it('should return the correct day', () => {
			expect(then.day).toEqual(28);
		});
	});

	describe('when adding a month to March 29, 2018', () => {
		let then;

		beforeEach(() => {
			then = new Day(2018, 3, 29).addMonths(1);
		});

		it('should return the correct year', () => {
			expect(then.year).toEqual(2018);
		});

		it('should return the correct month', () => {
			expect(then.month).toEqual(4);
		});

		it('should return the correct day', () => {
			expect(then.day).toEqual(29);
		});
	});

	describe('when subtracting a month from May 31, 2018', () => {
		let then;

		beforeEach(() => {
			then = new Day(2018, 5, 31).subtractMonths(1);
		});

		it('should return the correct year', () => {
			expect(then.year).toEqual(2018);
		});

		it('should return the correct month', () => {
			expect(then.month).toEqual(4);
		});

		it('should return the correct day', () => {
			expect(then.day).toEqual(30);
		});
	});
});

describe('When adding (or subtracting) years to (or from) a Day', () => {
	'use strict';

	describe('when adding 3 years to January 2, 2014', () => {
		let then;

		beforeEach(() => {
			then = new Day(2014, 1, 2).addYears(3);
		});

		it('should return the correct year', () => {
			expect(then.year).toEqual(2017);
		});

		it('should return the correct month', () => {
			expect(then.month).toEqual(1);
		});

		it('should return the correct day', () => {
			expect(then.day).toEqual(2);
		});
	});

	describe('when subtracting 3 years from January 2, 2017', () => {
		let then;

		beforeEach(() => {
			then = new Day(2017, 1, 2).subtractYears(3);
		});

		it('should return the correct year', () => {
			expect(then.year).toEqual(2014);
		});

		it('should return the correct month', () => {
			expect(then.month).toEqual(1);
		});

		it('should return the correct day', () => {
			expect(then.day).toEqual(2);
		});
	});

	describe('when adding 4 years to February 29, 2016', () => {
		let then;

		beforeEach(() => {
			then = new Day(2016, 2, 29).addYears(4);
		});

		it('should return the correct year', () => {
			expect(then.year).toEqual(2020);
		});

		it('should return the correct month', () => {
			expect(then.month).toEqual(2);
		});

		it('should return the correct day', () => {
			expect(then.day).toEqual(29);
		});
	});

	describe('when subtracting 4 years from February 29, 2020', () => {
		let then;

		beforeEach(() => {
			then = new Day(2020, 2, 29).subtractYears(4);
		});

		it('should return the correct year', () => {
			expect(then.year).toEqual(2016);
		});

		it('should return the correct month', () => {
			expect(then.month).toEqual(2);
		});

		it('should return the correct day', () => {
			expect(then.day).toEqual(29);
		});
	});

	describe('when adding 3 years to February 29, 2016', () => {
		let then;

		beforeEach(() => {
			then = new Day(2016, 2, 29).addYears(3);
		});

		it('should return the correct year', () => {
			expect(then.year).toEqual(2019);
		});

		it('should return the correct month', () => {
			expect(then.month).toEqual(2);
		});

		it('should return the correct day', () => {
			expect(then.day).toEqual(28);
		});
	});

	describe('when subtracting 3 years from February 28, 2019', () => {
		let then;

		beforeEach(() => {
			then = new Day(2019, 2, 28).subtractYears(3);
		});

		it('should return the correct year', () => {
			expect(then.year).toEqual(2016);
		});

		it('should return the correct month', () => {
			expect(then.month).toEqual(2);
		});

		it('should return the correct day', () => {
			expect(then.day).toEqual(28);
		});
	});

	describe('when subtracting 1 year from February 29, 2020', () => {
		let then;

		beforeEach(() => {
			then = new Day(2020, 2, 29).subtractYears(1);
		});

		it('should return the correct year', () => {
			expect(then.year).toEqual(2019);
		});

		it('should return the correct month', () => {
			expect(then.month).toEqual(2);
		});

		it('should return the correct day', () => {
			expect(then.day).toEqual(28);
		});
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
	it('toJSON should return the formatted day', () => {
		expect(Day.parse('2017-07-18').toJSON()).toEqual('2017-07-18');
	});

	it('compareDays should compare two Day instances', () => {
		expect({
			before: Day.compareDays(Day.parse('2017-07-18'), Day.parse('2017-07-19')) < 0,
			equal: Day.compareDays(Day.parse('2017-07-18'), Day.parse('2017-07-18')),
			after: Day.compareDays(Day.parse('2017-07-19'), Day.parse('2017-07-18')) > 0
		}).toEqual({
			before: true,
			equal: 0,
			after: true
		});
	});


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

describe('When counting days between two Days', () => {
	it('the number of days between today and today should be zero', () => {
		expect(Day.countDaysBetween(Day.getToday(), Day.getToday())).toEqual(0);
	});

	it('the number of days between today and tomorrow should be one', () => {
		expect(Day.countDaysBetween(Day.getToday(), Day.getToday().addDays(1))).toEqual(1);
	});

	it('the number of days between yesterday and today should be one', () => {
		expect(Day.countDaysBetween(Day.getToday().subtractDays(1), Day.getToday())).toEqual(1);
	});

	it('the number of days between tomorrow and yesterday should be negative two', () => {
		expect(Day.countDaysBetween(Day.getToday().addDays(1), Day.getToday().subtractDays(1))).toEqual(-2);
	});

	it('the number of days between 2024-04-29 and 2024-04-30 should be one', () => {
		expect(Day.countDaysBetween(new Day(2024, 4, 29), new Day(2024, 4, 30))).toEqual(1);
	});

	it('the number of days between 2024-04-29 and 2024-05-01 should be two', () => {
		expect(Day.countDaysBetween(new Day(2024, 4, 29), new Day(2024, 5, 1))).toEqual(2);
	});

	it('the number of days between 2023-12-01 and 2023-12-31 should be 30', () => {
		expect(Day.countDaysBetween(new Day(2023, 12, 1), new Day(2023, 12, 31))).toEqual(30);
	});

	it('the number of days between 2023-12-01 and 2024-01-01 should be 31', () => {
		expect(Day.countDaysBetween(new Day(2023, 12, 1), new Day(2024, 1, 1))).toEqual(31);
	});

	it('the number of days between 2023-12-01 and 2024-02-01 should be 62', () => {
		expect(Day.countDaysBetween(new Day(2023, 12, 1), new Day(2024, 2, 1))).toEqual(62);
	});

	it('the number of days between 2000-01-01 and 2024-04-29 should be 8885', () => {
		expect(Day.countDaysBetween(new Day(2000, 1, 1), new Day(2024, 4, 29))).toEqual(8885);
	});

	it('the number of days between 2024-04-29 and 2000-01-01 should be -8885', () => {
		expect(Day.countDaysBetween( new Day(2024, 4, 29), new Day(2000, 1, 1))).toEqual(-8885);
	});
});

describe('When checking the name of a day', () => {
	it('the name of 2024-04-28 should be "Sunday"', () => {
		expect((new Day(2024, 4, 28)).getName()).toEqual('Sunday');
	});

	it('the name of 2024-04-29 should be "Monday"', () => {
		expect((new Day(2024, 4, 29)).getName()).toEqual('Monday');
	});

	it('the name of 2024-04-30 should be "Tuesday"', () => {
		expect((new Day(2024, 4, 30)).getName()).toEqual('Tuesday');
	});

	it('the name of 2024-05-01 should be "Wednesday"', () => {
		expect((new Day(2024, 5, 1)).getName()).toEqual('Wednesday');
	});

	it('the name of 2000-01-01 should be "Saturday"', () => {
		expect((new Day(2000, 1, 1)).getName()).toEqual('Saturday');
	});

	it('the name of 2013-08-21 should be "Wednesday"', () => {
		expect((new Day(2013, 8, 21)).getName()).toEqual('Wednesday');
	});
});
