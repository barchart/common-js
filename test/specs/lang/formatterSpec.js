var formatter = require('./../../../lang/formatter');

describe('When formatting numbers', function() {
	'use strict';

	it('formatting 123 with six digits (no separator, no parenthesis)', function() {
		expect(formatter.numberToString(123, 6)).toEqual('123.000000');
	});
});