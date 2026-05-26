const TranslateResultProcessor = require('./../../../../data/processors/TranslateResultProcessor');

describe('When a TranslateResultProcessor is used on a property with string-based values', () => {
	'use strict';

	let processor;

	beforeEach(() => {
		processor = new TranslateResultProcessor({ propertyName: 'name', 'map': { Eero: 'cool', Bryan: 'super fly' } });
	});

	describe('and the property value matches a value in the map', () => {
		let result;
		let original;

		beforeEach((done) => {
			processor.process(original = { name: 'Eero' })
				.then((r) => {
					result = r;
					done();
				});
		});

		it('the original object should be returned', () => {
			expect(result).toBe(original);
		});

		it('the property value should be overwritten with the mapped value', () => {
			expect(result.name).toEqual('cool');
		});
	});

	describe('and the property value does not match value in the map', () => {
		let result;
		let original;

		beforeEach((done) => {
			processor.process(original = { name: 'Steve' })
				.then((r) => {
					result = r;
					done();
				});
		});

		it('the original object should be returned', () => {
			expect(result).toBe(original);
		});

		it('the property value should be unchanged', () => {
			expect(result.name).toEqual('Steve');
		});
	});
});


describe('When a TranslateResultProcessor is used on a property with numeric values', () => {
	'use strict';

	let processor;

	beforeEach(() => {
		processor = new TranslateResultProcessor({ propertyName: 'name', 'map': { 1: 'one', 2: 'two' } });
	});

	describe('and the property value matches a value in the map', () => {
		let result;
		let original;

		beforeEach((done) => {
			processor.process(original = { count: 1 })
				.then((r) => {
					result = r;
					done();
				});
		});

		it('the original object should be returned', () => {
			expect(result).toBe(original);
		});

		it('the property value should be overwritten with the mapped value', () => {
			expect(result.count).toEqual(1);
		});
	});

	describe('and the property value does not match value in the map', () => {
		let result;
		let original;

		beforeEach((done) => {
			processor.process(original = { count: 3 })
				.then((r) => {
					result = r;
					done();
				});
		});

		it('the original object should be returned', () => {
			expect(result).toBe(original);
		});

		it('the property value should be unchanged', () => {
			expect(result.count).toEqual(3);
		});
	});
});