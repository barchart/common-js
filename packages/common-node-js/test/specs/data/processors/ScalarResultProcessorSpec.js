const ScalarResultProcessor = require('./../../../../data/processors/ScalarResultProcessor');

describe('When a ScalarResultProcessor is used to process an array', () => {
	'use strict';

	let processor;

	let items;
	let result;

	beforeEach(() => {
		processor = new ScalarResultProcessor({ });
	});

	describe('that is empty', () => {
		let items;
		let result;

		beforeEach((done) => {
			processor.process(items = [ ])
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the result should be undefined', () => {
			expect(result).toEqual(undefined);
		});
	});

	describe('that has one item', () => {
		let items;
		let item;
		let result;

		beforeEach((done) => {
			processor.process(items = [ item = { } ])
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the result should be undefined', () => {
			expect(result).toEqual(item);
		});
	});

	describe('that has two items', () => {
		let items;
		let result;

		let threw;

		beforeEach((done) => {
			processor.process(items = [ { }, { } ])
				.then((r) => {
					threw = false;

					done();
				}).catch(() => {
					threw = true;

					done();
				});
		});

		it('an error should be thrown', () => {
			expect(threw).toEqual(true);
		});
	});
});