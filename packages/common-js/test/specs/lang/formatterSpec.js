import * as formatter from './../../../lang/formatter.js';

describe('When formatting numbers', () => {
	'use strict';

	it('formatting 123 with six digits (no separator, no parenthesis)', () => {
		expect(formatter.numberToString(123, 6)).toEqual('123.000000');
	});
});

describe('When rounding across the thousands boundary', () => {
	it('groups positive and negative rounded numbers', () => {
		expect(formatter.numberToString(999.999, 2, ',')).toEqual('1,000.00');
		expect(formatter.numberToString(-999.999, 2, ',')).toEqual('-1,000.00');
		expect(formatter.numberToString(-999.999, 2, ',', true)).toEqual('(1,000.00)');
		expect(formatter.numberToString(999.5, 0, ',')).toEqual('1,000');
	});

	it('leaves values below the rounded boundary and omitted separators alone', () => {
		expect(formatter.numberToString(999.994, 2, ',')).toEqual('999.99');
		expect(formatter.numberToString(999.999, 2)).toEqual('1000.00');
	});
});
