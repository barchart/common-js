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
		expect(function() { Day.parse(value) }).toThrow();
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