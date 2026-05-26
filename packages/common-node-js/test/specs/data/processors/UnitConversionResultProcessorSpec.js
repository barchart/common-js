const UnitConversionResultProcessor = require('./../../../../data/processors/UnitConversionResultProcessor');

describe('When a UnitConversionResultProcessor is created, using references', () => {
	'use strict';

	let processor;

	beforeEach(() => {
		processor = new UnitConversionResultProcessor({
			propertyName: 'converted',
			valueRef: 'distance',
			unitRef: 'unit',
			factorRef: 'ratio.value',
			numeratorUnitRef: 'ratio.numerator',
			denominatorUnitRef: 'ratio.denominator'
		});
	});

	describe('and the factor does not require conversion', () => {
		let ratio;

		let original;
		let result;

		beforeEach((done) => {
			ratio = {
				value: 1.61,
				numerator: 'kilometers',
				denominator: 'miles'
			};

			processor.process(original = {distance: 26.2, unit: 'miles', ratio: ratio})
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the original object should be returned', () => {
			expect(result).toBe(original);
		});

		it('the original object should now have a "converted" property', () => {
			expect(result.hasOwnProperty('converted')).toEqual(true);
		});

		it('the "converted" value should be', () => {
			expect(result.converted).toBeCloseTo(42.182, 3);
		});
	});

	describe('and the factor does require conversion', () => {
		let ratio;

		let original;
		let result;

		beforeEach((done) => {
			ratio = {
				value: 0.62,
				numerator: 'miles',
				denominator: 'kilometers'
			};

			processor.process(original = {distance: 26.2, unit: 'miles', ratio: ratio})
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the original object should be returned', () => {
			expect(result).toBe(original);
		});

		it('the original object should now have a "converted" property', () => {
			expect(result.hasOwnProperty('converted')).toEqual(true);
		});

		it('the "converted" value should be', () => {
			expect(result.converted).toBeCloseTo(42.258, 3);
		});
	});
});