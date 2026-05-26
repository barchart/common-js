const CoalesceResultProcessor = require('./../../../../data/processors/CoalesceResultProcessor');

describe('When a CoalesceResultProcessor is used to process an array', () => {
	'use strict';

	let processor;

	beforeEach(() => {
		processor = new CoalesceResultProcessor({ });
	});

	describe('where the first item is null', () => {
		let items;
		let result;

		let one;
		let two;
		let three;

		beforeEach((done) => {
			processor.process(items = [ one = null, two = 'hello', three = { } ])
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the result should be the second item', () => {
			expect(result).toBe(two);
		});
	});


	describe('where the first item is undefined', () => {
		let items;
		let result;

		let one;
		let two;
		let three;

		beforeEach((done) => {
			processor.process(items = [ one = undefined, two = [ ], three = 14 ])
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the result should be the second item', () => {
			expect(result).toBe(two);
		});
	});

	describe('where the first item is an object', () => {
		let items;
		let result;

		let one;
		let two;
		let three;

		beforeEach((done) => {
			processor.process(items = [ one = { }, two = 'test', three = 1234 ])
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the result should be the first item', () => {
			expect(result).toBe(one);
		});
	});
});