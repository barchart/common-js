import Currency from './../../../lang/Currency.js';
import Decimal from './../../../lang/Decimal.js';
import Money from './../../../lang/Money.js';

describe('When Money is constructed', () => {
	'use strict';

	let money;

	beforeEach(() => {
		money = new Money('12.345', Currency.USD);
	});

	it('should expose the decimal value', () => {
		expect({
			decimal: money.decimal instanceof Decimal,
			value: money.decimal.toFixed()
		}).toEqual({
			decimal: true,
			value: '12.345'
		});
	});

	it('should expose the currency', () => {
		expect(money.currency).toBe(Currency.USD);
	});

	it('should round to the supplied amount places', () => {
		expect(money.toAmount(2).decimal.toFixed()).toEqual('12.35');
	});

	it('should default amount rounding to two places', () => {
		expect(money.toAmount().decimal.toFixed()).toEqual('12.35');
	});

	it('should serialize to JSON', () => {
		expect(money.toJSON()).toEqual({
			decimal: money.decimal,
			currency: Currency.USD
		});
	});

	it('should parse serialized money decimal', () => {
		const parsed = Money.parse(money.toJSON());

		expect(parsed.decimal.toFixed()).toEqual('12.345');
	});

	it('should parse serialized money currency', () => {
		const parsed = Money.parse(money.toJSON());

		expect(parsed.currency).toBe(Currency.USD);
	});

	it('should accept Decimal values', () => {
		const decimal = new Decimal('1.23');

		expect(new Money(decimal, Currency.USD).decimal).toBe(decimal);
	});

	it('should validate currency arguments', () => {
		expect(() => new Money('1.23', null)).toThrow();
	});
});
