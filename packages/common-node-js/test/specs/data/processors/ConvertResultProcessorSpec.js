const ConvertResultProcessor = require('./../../../../data/processors/ConvertResultProcessor');

describe('When a ConvertResultProcessor is created to convert "age" property to a string', () => {
	'use strict';

	let processor;

	beforeEach(() => {
		processor = new ConvertResultProcessor({ propertyName: 'age', propertyType: 'string' });
	});

	describe('and an object with a "age" property is processed', () => {
		let result;
		let original;

		beforeEach((done) => {
			processor.process(original = { age: 42 })
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the original object should be returned', () => {
			expect(result).toBe(original);
		});

		it('the "age" property should be a string', () => {
			expect(typeof result.age).toEqual('string');
		});

		it('the "age" property should be 42', () => {
			expect(result.age).toEqual('42');
		});
	});
});

describe('When a ConvertResultProcessor is created to convert "age" property to a number', () => {
	'use strict';

	let processor;

	beforeEach(() => {
		processor = new ConvertResultProcessor({ propertyName: 'age', propertyType: 'number' });
	});

	describe('and an object with a "age" property is processed', () => {
		let result;
		let original;

		beforeEach((done) => {
			processor.process(original = { age: '42' })
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the original object should be returned', () => {
			expect(result).toBe(original);
		});

		it('the "age" property should be a string', () => {
			expect(typeof result.age).toEqual('number');
		});

		it('the "age" property should be 42', () => {
			expect(result.age).toEqual(42);
		});
	});
});