import * as formatter from './../../../lang/formatter.js';

describe('When formatting numbers', () => {
	'use strict';

	it('formatting 123 with six digits (no separator, no parenthesis)', () => {
		expect(formatter.numberToString(123, 6)).toEqual('123.000000');
	});
});
