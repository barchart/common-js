const Currency = require('./../../../lang/Currency'),
	Decimal = require('./../../../lang/Decimal'),
	Rate = require('./../../../lang/Rate');

describe('When parsing an "^EURUSD" rate of 1.2', () => {
	'use strict';

	let rate;

	beforeEach(() => {
		rate = Rate.fromPair(1.2, '^EURUSD');
	});

	it('the quote currency should be USD', () => {
		expect(rate.quote.code).toEqual('USD');
	});

	it('the base currency should be EUR', () => {
		expect(rate.base.code).toEqual('EUR');
	});

	it('the numerator currency should be USD', () => {
		expect(rate.numerator.code).toEqual('USD');
	});

	it('the denominator currency should be EUR', () => {
		expect(rate.denominator.code).toEqual('EUR');
	});

	it('the value should be 1.2', () => {
		expect(rate.decimal.getIsEqual(1.2)).toEqual(true);
	});

	describe('When converting 10 USD to EUR', () => {
		it('should be 8.33 EUR', () => {
			expect(Rate.convert(new Decimal(10), Currency.USD, Currency.EUR, rate).round(2).getIsEqual(8.33)).toEqual(true);
		});
	});

	describe('When converting 10 EUR to USD', () => {
		it('should be 12 USD', () => {
			expect(Rate.convert(new Decimal(10), Currency.EUR, Currency.USD, rate).round(2).getIsEqual(12)).toEqual(true);
		});
	});
});

describe('When parsing an "^USDEUR" rate of 0.8333', () => {
	'use strict';

	let rate;

	beforeEach(() => {
		rate = Rate.fromPair(0.8333, '^USDEUR');
	});

	it('the quote currency should be EUR', () => {
		expect(rate.quote.code).toEqual('EUR');
	});

	it('the base currency should be USD', () => {
		expect(rate.base.code).toEqual('USD');
	});

	it('the numerator currency should be EUR', () => {
		expect(rate.numerator.code).toEqual('EUR');
	});

	it('the denominator currency should be USD', () => {
		expect(rate.denominator.code).toEqual('USD');
	});

	it('the value should be 0.8333', () => {
		expect(rate.decimal.getIsEqual(0.8333)).toEqual(true);
	});

	describe('When converting 10 USD to EUR', () => {
		it('should be 8.33 EUR', () => {
			expect(Rate.convert(new Decimal(10), Currency.USD, Currency.EUR, rate).round(2).getIsEqual(8.33)).toEqual(true);
		});
	});

	describe('When converting 10 EUR to USD', () => {
		it('should be 12 USD', () => {
			expect(Rate.convert(new Decimal(10), Currency.EUR, Currency.USD, rate).round(2).getIsEqual(12)).toEqual(true);
		});
	});
});
