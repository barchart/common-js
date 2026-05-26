let Timezones = require('./../../../lang/Timezones');

describe('When accessing static items', () =>  {
	'use strict';

	it('The timezone for Chicago should return the expected item', () =>  {
		expect(Timezones.AMERICA_CHICAGO.code).toEqual('America/Chicago');
	});

	it('The timezone for New York should return the expected item', () =>  {
		expect(Timezones.AMERICA_NEW_YORK.code).toEqual('America/New_York');
	});
});

describe('When calculating timezone offset on 2019-10-02 UTC', () =>  {
	let timestamp;

	beforeEach(() => {
		timestamp = (new Date(2019, 9, 2, 0, 0, 0)).getTime();
	});
	
	describe('in minutes', () => {
		it('The UTC offset should be 0', () =>  {
			expect(Timezones.UTC.getUtcOffset(timestamp)).toEqual(0);
		});

		it('The AMERICA_CHICAGO offset should be -300', () =>  {
			expect(Timezones.AMERICA_CHICAGO.getUtcOffset(timestamp)).toEqual(-300);
		});

		it('The AMERICA_NEW_YORK offset should be -240', () =>  {
			expect(Timezones.AMERICA_NEW_YORK.getUtcOffset(timestamp)).toEqual(-240);
		});

		it('The Europe/Minsk offset should be 180', () =>  {
			expect(Timezones.parse('Europe/Minsk').getUtcOffset(timestamp)).toEqual(180);
		});
	});

	describe('in milliseconds', () => {
		it('The UTC offset should be 0', () =>  {
			expect(Timezones.UTC.getUtcOffset(timestamp)).toEqual(0);
		});

		it('The AMERICA_CHICAGO offset should be -300', () =>  {
			expect(Timezones.AMERICA_CHICAGO.getUtcOffset(timestamp, true)).toEqual(-18000000);
		});

		it('The AMERICA_NEW_YORK offset should be -240', () =>  {
			expect(Timezones.AMERICA_NEW_YORK.getUtcOffset(timestamp, true)).toEqual(-14400000);
		});

		it('The Europe/Minsk offset should be 180', () =>  {
			expect(Timezones.parse('Europe/Minsk').getUtcOffset(timestamp, true)).toEqual(10800000);
		});
	});
});

describe('When calculating timezone offset on 2019-11-04 UTC', () =>  {
	let timestamp;

	beforeEach(() => {
		timestamp = (new Date(2019, 10, 4, 0, 0, 0)).getTime();
	});

	describe('in minutes', () => {
		it('The UTC offset should be 0', () =>  {
			expect(Timezones.UTC.getUtcOffset(timestamp)).toEqual(0);
		});

		it('The AMERICA_CHICAGO offset should be -360', () =>  {
			expect(Timezones.AMERICA_CHICAGO.getUtcOffset(timestamp)).toEqual(-360);
		});

		it('The AMERICA_NEW_YORK offset should be -300', () =>  {
			expect(Timezones.AMERICA_NEW_YORK.getUtcOffset(timestamp)).toEqual(-300);
		});

		it('The Europe/Minsk offset should be 180', () =>  {
			expect(Timezones.parse('Europe/Minsk').getUtcOffset(timestamp)).toEqual(180);
		});
	});

	describe('in milliseconds', () => {
		it('The UTC offset should be 0', () =>  {
			expect(Timezones.UTC.getUtcOffset(timestamp, true)).toEqual(0);
		});

		it('The AMERICA_CHICAGO offset should be -360', () =>  {
			expect(Timezones.AMERICA_CHICAGO.getUtcOffset(timestamp, true)).toEqual(-21600000);
		});

		it('The AMERICA_NEW_YORK offset should be -300', () =>  {
			expect(Timezones.AMERICA_NEW_YORK.getUtcOffset(timestamp, true)).toEqual(-18000000);
		});

		it('The Europe/Minsk offset should be 180', () =>  {
			expect(Timezones.parse('Europe/Minsk').getUtcOffset(timestamp, true)).toEqual(10800000);
		});
	});
});

describe('When attempting to determine if daylight savings time is in effect', () => {
	it('should be in effect on 2020-07-01 at 00:00 in AMERICA_CHICAGO', () => {
		expect(Timezones.AMERICA_CHICAGO.getIsDaylightSavingsTime(1593666000000)).toEqual(true);
	});

	it('should not be in effect on 2020-12-01 at 00:00 in AMERICA_CHICAGO', () => {
		expect(Timezones.AMERICA_CHICAGO.getIsDaylightSavingsTime(1606802400000)).toEqual(false);
	});
});