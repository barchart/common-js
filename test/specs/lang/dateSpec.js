var dateUtilities = require('./../../../lang/date');

describe('When extracting the "short" day of week', function() {
	'use strict';

	const july = 7 - 1;

	it("07/27/2016 should resove to 'Wed'", function() {
		expect(dateUtilities.getShortDay(new Date(2016, july, 27))).toEqual('Wed');
	});
});