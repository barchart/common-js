const FormatPriceResultProcessor = require('./../../../../data/processors/FormatPriceResultProcessor');

describe('When a FormatPriceResultProcessor using property references', () => {
	'use strict';

	let processor;

	beforeEach(() => {
		processor = new FormatPriceResultProcessor({ propertyName: 'price', baseCodePropertyName: 'baseCode', fractionSeparatorPropertyName: 'fractionSeparator'  });
	});

	describe('and an object with a price of 1234.5, unit code of -1, and a dash fraction separator', () => {
		let result;
		let original;

		beforeEach((done) => {
			processor.process(original = { price: 1234.5, baseCode: -1, fractionSeparator: '-' })
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the original object should be returned', () => {
			expect(result).toBe(original);
		});

		it('the price property should now be a string', () => {
			expect(typeof result.price).toEqual('string');
		});

		it('the price property should be formatted as "1234-4"', () => {
			expect(result.price).toEqual('1234-4');
		});
	});

	describe('and an object with a price of -1234.5, unit code of -1, and a dash fraction separator', () => {
		let result;
		let original;

		beforeEach((done) => {
			processor.process(original = { price: 1234.5, baseCode: -1, fractionSeparator: '-' })
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the original object should be returned', () => {
			expect(result).toBe(original);
		});

		it('the price property should now be a string', () => {
			expect(typeof result.price).toEqual('string');
		});

		it('the price property should be formatted as "1234-4"', () => {
			expect(result.price).toEqual('1234-4');
		});
	});
});

describe('When a FormatPriceResultProcessor using property references and parenthetical negatives', () => {
	'use strict';

	let processor;

	beforeEach(() => {
		processor = new FormatPriceResultProcessor({ propertyName: 'price', baseCodePropertyName: 'baseCode', fractionSeparatorPropertyName: 'fractionSeparator', useParenthesis: true });
	});

	describe('and an object with a price of 1234.5, unit code of -1, and a dash fraction separator', () => {
		let result;
		let original;

		beforeEach((done) => {
			processor.process(original = { price: 1234.5, baseCode: -1, fractionSeparator: '-' })
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the original object should be returned', () => {
			expect(result).toBe(original);
		});

		it('the price property should now be a string', () => {
			expect(typeof result.price).toEqual('string');
		});

		it('the price property should be formatted as "1234-4"', () => {
			expect(result.price).toEqual('1234-4');
		});
	});

	describe('and an object with a price of -1234.5, unit code of -1, and a dash fraction separator', () => {
		let result;
		let original;

		beforeEach((done) => {
			processor.process(original = { price: -1234.5, baseCode: -1, fractionSeparator: '-' })
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the original object should be returned', () => {
			expect(result).toBe(original);
		});

		it('the price property should now be a string', () => {
			expect(typeof result.price).toEqual('string');
		});

		it('the price property should be formatted as "(1234-4)"', () => {
			expect(result.price).toEqual('(1234-4)');
		});
	});
});