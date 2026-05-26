const Currency= require('./../../../lang/Currency'),
	Decimal= require('./../../../lang/Decimal'),
	Rate = require('./../../../lang/Rate');

const CurrencyTranslator = require('./../../../lang/CurrencyTranslator');

describe('When a CurrencyTranslator is created with ^AUDUSD and ^CADUSD', () => {
	'use strict';

	let translator = new CurrencyTranslator([ '^AUDUSD', '^CADUSD' ]);

	describe('and translations are performed before rates are initialized', () => {
		it('Direct translation of 0 AUD to USD should yield 0 USD', () => {
			expect(() => translator.translate(0, Currency.AUD, Currency.USD)).toThrow();
		});
	});

	describe('and rates are initialized (^AUDUSD to 0.6656 and ^CADUSD to 0.7230)', () => {
		beforeEach(() => {
			translator.setRates([
				Rate.fromPair(0.6656, '^AUDUSD'),
				Rate.fromPair(0.7230, '^CADUSD')
			]);
		});

		describe('and translations are performed (on floats)', () => {
			it('Direct translation of of a float should return a float', () => {
				expect(typeof translator.translate(123.456, Currency.AUD, Currency.USD)).toEqual('number');
			});

			it('Direct translation of 0 AUD to USD should yield 0 USD', () => {
				expect(translator.translate(0, Currency.AUD, Currency.USD)).toBeCloseTo(0, 4);
			});

			it('Direct translation of 1 AUD to USD should yield 0.6656 USD', () => {
				expect(translator.translate(1, Currency.AUD, Currency.USD)).toBeCloseTo(0.6656, 4);
			});

			it('Direct translation of 1 USD to AUD should yield 1.3831 AUD', () => {
				expect(translator.translate(1, Currency.USD, Currency.AUD)).toBeCloseTo(1.5024, 4);
			});

			it('Direct translation of 1 CAD to USD should yield 0.7230 USD', () => {
				expect(translator.translate(1, Currency.CAD, Currency.USD)).toBeCloseTo(0.7230, 4);
			});

			it('Direct translation of 1 USD to CAD should yield 1.3831 CAD', () => {
				expect(translator.translate(1, Currency.USD, Currency.CAD)).toBeCloseTo(1.3831, 4);
			});

			it('Indirect translation of 0 AUD to CAD should yield 0 CAD', () => {
				expect(translator.translate(0, Currency.AUD, Currency.CAD)).toBeCloseTo(0, 4);
			});

			it('Indirect translation of 1 AUD to CAD should yield 0.9206 CAD', () => {
				expect(translator.translate(1, Currency.AUD, Currency.CAD)).toBeCloseTo(0.9206, 4);
			});

			it('Indirect translation of 1 CAD to AUD should yield 1.0862 AUD', () => {
				expect(translator.translate(1, Currency.CAD, Currency.AUD)).toBeCloseTo(1.0862, 4);
			});
		});

		describe('and translations are performed (on Decimal instances)', () => {
			it('Direct translation of of a Decimal should return a Decimal', () => {
				expect(translator.translate(new Decimal(123.456), Currency.AUD, Currency.USD) instanceof Decimal).toBeTrue();
			});

			it('Direct translation of 0 AUD to USD should yield 0 USD', () => {
				expect(translator.translate(new Decimal(0), Currency.AUD, Currency.USD).toNumber()).toBeCloseTo(0, 4);
			});

			it('Direct translation of 1 AUD to USD should yield 0.6656 USD', () => {
				expect(translator.translate(new Decimal(1), Currency.AUD, Currency.USD).toNumber()).toBeCloseTo(0.6656, 4);
			});

			it('Direct translation of 1 USD to AUD should yield 1.3831 AUD', () => {
				expect(translator.translate(new Decimal(1), Currency.USD, Currency.AUD).toNumber()).toBeCloseTo(1.5024, 4);
			});

			it('Direct translation of 1 CAD to USD should yield 0.7230 USD', () => {
				expect(translator.translate(new Decimal(1), Currency.CAD, Currency.USD).toNumber()).toBeCloseTo(0.7230, 4);
			});

			it('Direct translation of 1 USD to CAD should yield 1.3831 CAD', () => {
				expect(translator.translate(new Decimal(1), Currency.USD, Currency.CAD).toNumber()).toBeCloseTo(1.3831, 4);
			});

			it('Indirect translation of 0 AUD to CAD should yield 0 CAD', () => {
				expect(translator.translate(new Decimal(0), Currency.AUD, Currency.CAD).toNumber()).toBeCloseTo(0, 4);
			});

			it('Indirect translation of 1 AUD to CAD should yield 0.9206 CAD', () => {
				expect(translator.translate(new Decimal(1), Currency.AUD, Currency.CAD).toNumber()).toBeCloseTo(0.9206, 4);
			});

			it('Indirect translation of 1 CAD to AUD should yield 1.0862 AUD', () => {
				expect(translator.translate(new Decimal(1), Currency.CAD, Currency.AUD).toNumber()).toBeCloseTo(1.0862, 4);
			});
		});

		describe('and one rate changes (^AUDUSD to 0.6800)', () => {
			beforeEach(() => {
				translator.setRates([
					Rate.fromPair(0.6800, '^AUDUSD')
				]);
			});

			describe('and translations are performed (on floats)', () => {
				it('Direct translation of 0 AUD to USD should yield 0.6800 USD', () => {
					expect(translator.translate(0, Currency.AUD, Currency.USD)).toBeCloseTo(0, 4);
				});

				it('Direct translation of 1 AUD to USD should yield 0.6800 USD', () => {
					expect(translator.translate(1, Currency.AUD, Currency.USD)).toBeCloseTo(0.6800, 4);
				});

				it('Direct translation of 1 USD to AUD should yield 1.4706 CAD', () => {
					expect(translator.translate(1, Currency.USD, Currency.AUD)).toBeCloseTo(1.4706, 4);
				});

				it('Direct translation of 1 CAD to USD should yield 0.7230 USD', () => {
					expect(translator.translate(1, Currency.CAD, Currency.USD)).toBeCloseTo(0.7230, 4);
				});

				it('Direct translation of 1 USD to CAD should yield 1.3831 CAD', () => {
					expect(translator.translate(1, Currency.USD, Currency.CAD)).toBeCloseTo(1.3831, 4);
				});

				it('Indirect translation of 0 AUD to CAD should yield 0.9405 CAD', () => {
					expect(translator.translate(0, Currency.AUD, Currency.CAD)).toBeCloseTo(0, 4);
				});

				it('Indirect translation of 1 AUD to CAD should yield 0.9405 CAD', () => {
					expect(translator.translate(1, Currency.AUD, Currency.CAD)).toBeCloseTo(0.9405, 4);
				});

				it('Indirect translation of 1 CAD to AUD should yield 1.0632 AUD', () => {
					expect(translator.translate(1, Currency.CAD, Currency.AUD)).toBeCloseTo(1.0632, 4);
				});
			});

			describe('and translations are performed (on Decimal instances)', () => {
				it('Direct translation of 0 AUD to USD should yield 0.6800 USD', () => {
					expect(translator.translate(new Decimal(0), Currency.AUD, Currency.USD).toNumber()).toBeCloseTo(0, 4);
				});

				it('Direct translation of 1 AUD to USD should yield 0.6800 USD', () => {
					expect(translator.translate(new Decimal(1), Currency.AUD, Currency.USD).toNumber()).toBeCloseTo(0.6800, 4);
				});

				it('Direct translation of 1 USD to AUD should yield 1.4706 CAD', () => {
					expect(translator.translate(new Decimal(1), Currency.USD, Currency.AUD).toNumber()).toBeCloseTo(1.4706, 4);
				});

				it('Direct translation of 1 CAD to USD should yield 0.7230 USD', () => {
					expect(translator.translate(new Decimal(1), Currency.CAD, Currency.USD).toNumber()).toBeCloseTo(0.7230, 4);
				});

				it('Direct translation of 1 USD to CAD should yield 1.3831 CAD', () => {
					expect(translator.translate(new Decimal(1), Currency.USD, Currency.CAD).toNumber()).toBeCloseTo(1.3831, 4);
				});

				it('Indirect translation of 0 AUD to CAD should yield 0.9405 CAD', () => {
					expect(translator.translate(new Decimal(0), Currency.AUD, Currency.CAD).toNumber()).toBeCloseTo(0, 4);
				});

				it('Indirect translation of 1 AUD to CAD should yield 0.9405 CAD', () => {
					expect(translator.translate(new Decimal(1), Currency.AUD, Currency.CAD).toNumber()).toBeCloseTo(0.9405, 4);
				});

				it('Indirect translation of 1 CAD to AUD should yield 1.0632 AUD', () => {
					expect(translator.translate(new Decimal(1), Currency.CAD, Currency.AUD).toNumber()).toBeCloseTo(1.0632, 4);
				});
			});
		});
	});
});

describe('When a CurrencyTranslator is created with ^AUDUSD and ^USDEUR', () => {
	'use strict';

	let translator = new CurrencyTranslator([ '^AUDUSD', '^USDEUR' ]);

	describe('and rates are initialized (^AUDUSD to 0.6 and ^USDEUR to 0.9)', () => {
		beforeEach(() => {
			translator.setRates([
				Rate.fromPair(0.6, '^AUDUSD'),
				Rate.fromPair(0.9, '^USDEUR')
			]);
		});

		describe('and translations are performed (on floats)', () => {
			it('Direct translation of 1 AUD to USD should yield 0.6 USD', () => {
				expect(translator.translate(1, Currency.AUD, Currency.USD)).toBeCloseTo(0.6, 4);
			});

			it('Indirect translation of 1 AUD to EUR should yield 0.54 EUR', () => {
				expect(translator.translate(1, Currency.AUD, Currency.EUR)).toBeCloseTo(0.54, 4);
			});
		});

		describe('and one rate changes (^AUDUSD to 0.7)', () => {
			beforeEach(() => {
				translator.setRates([
					Rate.fromPair(0.7, '^AUDUSD')
				]);
			});

			describe('and translations are performed (on floats)', () => {
				it('Direct translation of 1 AUD to USD should yield 0.7 USD', () => {
					expect(translator.translate(1, Currency.AUD, Currency.USD)).toBeCloseTo(0.7, 4);
				});

				it('Indirect translation of 1 AUD to EUR should yield 0.63 EUR', () => {
					expect(translator.translate(1, Currency.AUD, Currency.EUR)).toBeCloseTo(0.63, 4);
				});
			});
		});
	});
});






