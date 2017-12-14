var utilities = require('./../../../lang/date');

describe('When extracting the "short" day of week', function() {
	'use strict';

	const july = 7 - 1;

	it("07/27/2016 should resove to 'Wed'", function() {
		expect(utilities.getShortDay(new Date(2016, july, 27))).toEqual('Wed');
	});
});

describe('When determining the ordinal for a date', function() {
	'use strict';

	const july = 7 - 1;

	it('should return "st" for the first of the month', function() {
		expect(utilities.getDateOrdinal(new Date(2017, july, 1))).toEqual('st');
	});

	it('should return "nd" for the second of the month', function() {
		expect(utilities.getDateOrdinal(new Date(2017, july, 2))).toEqual('nd');
	});

	it('should return "rd" for the third of the month', function() {
		expect(utilities.getDateOrdinal(new Date(2017, july, 3))).toEqual('rd');
	});

	it('should return "th" for the fourth of the month', function() {
		expect(utilities.getDateOrdinal(new Date(2017, july, 4))).toEqual('th');
	});

	it('should return "th" for the fifth of the month', function() {
		expect(utilities.getDateOrdinal(new Date(2017, july, 5))).toEqual('th');
	});

	it('should return "th" for the sixth of the month', function() {
		expect(utilities.getDateOrdinal(new Date(2017, july, 6))).toEqual('th');
	});

	it('should return "th" for the seventh of the month', function() {
		expect(utilities.getDateOrdinal(new Date(2017, july, 7))).toEqual('th');
	});

	it('should return "th" for the eighth of the month', function() {
		expect(utilities.getDateOrdinal(new Date(2017, july, 8))).toEqual('th');
	});

	it('should return "th" for the ninth of the month', function() {
		expect(utilities.getDateOrdinal(new Date(2017, july, 9))).toEqual('th');
	});

	it('should return "th" for the tenth of the month', function() {
		expect(utilities.getDateOrdinal(new Date(2017, july, 10))).toEqual('th');
	});

	it('should return "th" for the eleventh of the month', function() {
		expect(utilities.getDateOrdinal(new Date(2017, july, 11))).toEqual('th');
	});

	it('should return "th" for the twelfth of the month', function() {
		expect(utilities.getDateOrdinal(new Date(2017, july, 12))).toEqual('th');
	});

	it('should return "th" for the thirteenth of the month', function() {
		expect(utilities.getDateOrdinal(new Date(2017, july, 13))).toEqual('th');
	});

	it('should return "th" for the fourteenth of the month', function() {
		expect(utilities.getDateOrdinal(new Date(2017, july, 14))).toEqual('th');
	});

	it('should return "th" for the fifteenth of the month', function() {
		expect(utilities.getDateOrdinal(new Date(2017, july, 15))).toEqual('th');
	});

	it('should return "th" for the sixteenth of the month', function() {
		expect(utilities.getDateOrdinal(new Date(2017, july, 16))).toEqual('th');
	});

	it('should return "th" for the seventeenth of the month', function() {
		expect(utilities.getDateOrdinal(new Date(2017, july, 17))).toEqual('th');
	});

	it('should return "th" for the eighteenth of the month', function() {
		expect(utilities.getDateOrdinal(new Date(2017, july, 18))).toEqual('th');
	});

	it('should return "th" for the nineteenth of the month', function() {
		expect(utilities.getDateOrdinal(new Date(2017, july, 19))).toEqual('th');
	});

	it('should return "th" for the twentieth of the month', function() {
		expect(utilities.getDateOrdinal(new Date(2017, july, 20))).toEqual('th');
	});

	it('should return "th" for the twenty first of the month', function() {
		expect(utilities.getDateOrdinal(new Date(2017, july, 21))).toEqual('st');
	});

	it('should return "th" for the twenty second of the month', function() {
		expect(utilities.getDateOrdinal(new Date(2017, july, 22))).toEqual('nd');
	});

	it('should return "th" for the twenty third of the month', function() {
		expect(utilities.getDateOrdinal(new Date(2017, july, 23))).toEqual('rd');
	});

	it('should return "th" for the twenty fourth of the month', function() {
		expect(utilities.getDateOrdinal(new Date(2017, july, 24))).toEqual('th');
	});

	it('should return "th" for the twenty fifth of the month', function() {
		expect(utilities.getDateOrdinal(new Date(2017, july, 25))).toEqual('th');
	});

	it('should return "th" for the twenty sixth of the month', function() {
		expect(utilities.getDateOrdinal(new Date(2017, july, 26))).toEqual('th');
	});

	it('should return "th" for the twenty seventh of the month', function() {
		expect(utilities.getDateOrdinal(new Date(2017, july, 27))).toEqual('th');
	});

	it('should return "th" for the twenty eighth of the month', function() {
		expect(utilities.getDateOrdinal(new Date(2017, july, 28))).toEqual('th');
	});

	it('should return "th" for the twenty ninth of the month', function() {
		expect(utilities.getDateOrdinal(new Date(2017, july, 29))).toEqual('th');
	});

	it('should return "th" for the thirtieth of the month', function() {
		expect(utilities.getDateOrdinal(new Date(2017, july, 30))).toEqual('th');
	});

	it('should return "th" for the thirty first of the month', function() {
		expect(utilities.getDateOrdinal(new Date(2017, july, 31))).toEqual('st');
	});
});