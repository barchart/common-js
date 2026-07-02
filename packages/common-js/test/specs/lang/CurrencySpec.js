import Currency from './../../../lang/Currency.js';

describe('When Currency values are used', () => {
	'use strict';

	const codes = [
		'ARS', 'AUD', 'BMD', 'BRL', 'BSD', 'CAD', 'CHF', 'CNY', 'CZK', 'DKK',
		'EUR', 'FJD', 'GBP', 'GBX', 'GHS', 'HKD', 'HUF', 'IDR', 'ILS', 'JOD',
		'JPY', 'KRW', 'LBP', 'MXN', 'MYR', 'NAD', 'NGN', 'NOK', 'NZD', 'PEN',
		'PGK', 'PHP', 'PLN', 'RUB', 'RUR', 'SEK', 'SGD', 'THB', 'TRY', 'TWD',
		'USD', 'UYI', 'ZAR', 'ZMW'
	];

	codes.forEach((code) => {
		it(`should expose ${code}`, () => {
			expect({
				instance: Currency[code] instanceof Currency,
				code: Currency[code].code,
				parsed: Currency.parse(code)
			}).toEqual({
				instance: true,
				code,
				parsed: Currency[code]
			});
		});
	});

	it('should expose precision and alternate description', () => {
		expect({
			precision: Currency.USD.precision,
			alternateDescription: Currency.USD.alternateDescription
		}).toEqual({
			precision: 2,
			alternateDescription: 'US$'
		});
	});

	it('should return null for unknown codes', () => {
		expect(Currency.parse('UNKNOWN')).toBeNull();
	});

	it('should accept valid constructor arguments', () => {
		expect(() => new Currency('XTS', 'Test', 2, 'Test$')).not.toThrow();
	});

	it('should reject invalid precision', () => {
		expect(() => new Currency('XTS', 'Test', 2.5)).toThrow();
	});
});
