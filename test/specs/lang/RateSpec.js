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

describe('When parsing a "^GBPUSD" rate of 1.25882', () => {
	'use strict';

	let rate;

	beforeEach(() => {
		rate = Rate.fromPair(1.25882, '^GBPUSD');
	});

	it('the quote currency should be USD', () => {
		expect(rate.quote.code).toEqual('USD');
	});

	it('the base currency should be GBP', () => {
		expect(rate.base.code).toEqual('GBP');
	});

	it('the numerator currency should be USD', () => {
		expect(rate.numerator.code).toEqual('USD');
	});

	it('the denominator currency should be GBP', () => {
		expect(rate.denominator.code).toEqual('GBP');
	});

	it('the value should be 1.25882', () => {
		expect(rate.decimal.getIsEqual(1.25882)).toEqual(true);
	});

	describe('When converting 10 GBP to USD', () => {
		it('should be 12.59 USD', () => {
			expect(Rate.convert(new Decimal(10), Currency.GBP, Currency.USD, rate).round(2).getIsEqual(12.59)).toEqual(true);
		});
	});

	describe('When converting 1000 GBX to USD', () => {
		it('should be 12.59 USD', () => {
			expect(Rate.convert(new Decimal(1000), Currency.GBX, Currency.USD, rate).round(2).getIsEqual(12.59)).toEqual(true);
		});
	});

	describe('When converting 1 USD to GBX', () => {
		it('should be 79.44 USD', () => {
			expect(Rate.convert(new Decimal(1), Currency.USD, Currency.GBX, rate).round(2).getIsEqual(79.44)).toEqual(true);
		});
	});

	it('1 GBP should be 100 GBX', () => {
		expect(Rate.convert(Decimal.ONE, Currency.GBP, Currency.GBX).round(2).getIsEqual(100)).toEqual(true);
	});

	it('1 GBX should be 0.01 GBP', () => {
		expect(Rate.convert(Decimal.ONE, Currency.GBX, Currency.GBP).round(2).getIsEqual(0.01)).toEqual(true);
	});
});

describe('When parsing a "^EURGBX" rate of 85.503', () => {
	'use strict';

	let rate;

	beforeEach(() => {
		rate = Rate.fromPair(85.503, '^EURGBX');
	});

	it('the quote currency should be GBX', () => {
		expect(rate.quote.code).toEqual('GBX');
	});

	it('the base currency should be EUR', () => {
		expect(rate.base.code).toEqual('EUR');
	});

	it('the numerator currency should be GBX', () => {
		expect(rate.numerator.code).toEqual('GBX');
	});

	it('the denominator currency should be EUR', () => {
		expect(rate.denominator.code).toEqual('EUR');
	});

	it('the value should be 85.503', () => {
		expect(rate.decimal.getIsEqual(85.503)).toEqual(true);
	});

	describe('When converting 100 GBX to EUR', () => {
		it('should be 1.17 EUR', () => {
			expect(Rate.convert(new Decimal(100), Currency.GBX, Currency.EUR, rate).round(2).getIsEqual(1.17)).toEqual(true);
		});
	});

	describe('When converting 1 GBP to EUR', () => {
		it('should be 1.17 EUR', () => {
			expect(Rate.convert(new Decimal(1), Currency.GBP, Currency.EUR, rate).round(2).getIsEqual(1.17)).toEqual(true);
		});
	});
});
