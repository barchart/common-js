const DefaultResultProcessor = require('./../../../../data/processors/DefaultResultProcessor');

describe('When a DefaultResultProcessor is created, specifying a default "name" property', () => {
	'use strict';

	let processor;

	beforeEach(() => {
		processor = new DefaultResultProcessor({ propertyName: 'name', defaultValue: 'Bob' });
	});

	describe('and an object with a "name" property is processed', () => {
		let result;
		let original;

		beforeEach((done) => {
			processor.process(original = { name: 'Robert' })
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the original object should be returned', () => {
			expect(result).toBe(original);
		});

		it('the name property should be unchanged', () => {
			expect(result.name).toEqual('Robert');
		});
	});

	describe('and an object without a "name" property is processed', () => {
		let result;
		let original;

		beforeEach((done) => {
			processor.process(original = { })
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the original object should be returned', () => {
			expect(result).toBe(original);
		});

		it('the name property should be set to the default value', () => {
			expect(result.name).toEqual('Bob');
		});
	});
});