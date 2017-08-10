var Enum = require('./../../../lang/Enum'),
	Timezones = require('./../../../lang/Timezones');

describe('When accessing static items', function() {
	'use strict';

	it('The timezone for Chicago should return the expected item', function() {
		expect(Timezones.AMERICA_CHICAGO.code).toEqual('America/Chicago');
	});

	it('The timezone for New York should return the expected item', function() {
		expect(Timezones.AMERICA_NEW_YORK.code).toEqual('America/New_York');
	});
});