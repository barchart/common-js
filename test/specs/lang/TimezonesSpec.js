var Timezones = require('./../../../lang/Timezones');

describe('When accessing static items', function() {
	'use strict';

	it('The timezone for Chicago should return the expected item', function() {
		expect(Timezones.AMERICA_CHICAGO.code).toEqual('America/Chicago');
	});

	it('The timezone for New York should return the expected item', function() {
		expect(Timezones.AMERICA_NEW_YORK.code).toEqual('America/New_York');
	});
});

describe('When calculating timezone offset on 2019-10-02 UTC', function() {
	let timestamp;

	beforeEach(() => {
		timestamp = (new Date(2019, 9, 2, 0, 0, 0)).getTime();
	});

	it('The UTC offset should be 0', function() {
		expect(Timezones.UTC.getUtcOffset(timestamp)).toEqual(0);
	});

	it('The AMERICA_CHICAGO offset should be -300', function() {
		expect(Timezones.AMERICA_CHICAGO.getUtcOffset(timestamp)).toEqual(-300);
	});

	it('The AMERICA_NEW_YORK offset should be -240', function() {
		expect(Timezones.AMERICA_NEW_YORK.getUtcOffset(timestamp)).toEqual(-240);
	});
});

describe('When calculating timezone offset on 2019-11-04 UTC', function() {
	let timestamp;

	beforeEach(() => {
		timestamp = (new Date(2019, 10, 4, 0, 0, 0)).getTime();
	});

	it('The UTC offset should be 0', function() {
		expect(Timezones.UTC.getUtcOffset(timestamp)).toEqual(0);
	});

	it('The AMERICA_CHICAGO offset should be -300', function() {
		expect(Timezones.AMERICA_CHICAGO.getUtcOffset(timestamp)).toEqual(-360);
	});

	it('The AMERICA_NEW_YORK offset should be -240', function() {
		expect(Timezones.AMERICA_NEW_YORK.getUtcOffset(timestamp)).toEqual(-300);
	});
});