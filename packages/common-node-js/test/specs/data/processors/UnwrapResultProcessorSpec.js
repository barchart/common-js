const UnwrapResultProcessor = require('./../../../../data/processors/UnwrapResultProcessor');

describe('When a UnwrapResultProcessor is created', () => {
	'use strict';

	let processor;
	let configuration;

	beforeEach(() => {
		processor = new UnwrapResultProcessor(configuration = { propertyName: 'a.b.c' });
	});

	describe('and an object, having the property name, is unwrapped', () => {
		let context;
		let result;

		beforeEach((done) => {
			processor.process(context = { a: { b: { c: { } } } })
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the result should be an object', () => {
			expect(result instanceof Object).toEqual(true);
		});

		it('the result should be a reference to the context object', () => {
			expect(result).toBe(context.a.b.c);
		});
	});
});