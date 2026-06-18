import * as converters from './../../../lang/converters.js';

describe('When converters are used', () => {
	'use strict';

	it('should convert values to dates', () => {
		const date = converters.toDate('2026-06-17T00:00:00.000Z');

		expect({
			instance: date instanceof Date,
			value: date.toISOString()
		}).toEqual({
			instance: true,
			value: '2026-06-17T00:00:00.000Z'
		});
	});

	it('should return values unchanged for the empty converter', () => {
		const value = { id: 1 };

		expect(converters.empty(value)).toBe(value);
	});
});
