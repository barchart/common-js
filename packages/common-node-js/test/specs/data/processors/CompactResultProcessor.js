const CompactResultProcessor = require('./../../../../data/processors/CompactResultProcessor');

describe('When a CompactResultProcessor is used to process an array', () => {
	'use strict';

	let processor;

	beforeEach(() => {
		processor = new CompactResultProcessor({ });
	});

	describe('with a null and undefined item', () => {
		let items;
		let result;

		let one;
		let two;
		let three;
		let four;

		beforeEach((done) => {
			processor.process(items = [ one = null, two = 'hello', three = { }, four = undefined ])
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the result not be the original array', () => {
			expect(result).not.toBe(items);
		});

		it('the result should have two items', () => {
			expect(result.length).toEqual(2);
		});

		it('the first item should be the second item of the original array', () => {
			expect(result[0]).toBe(two);
		});

		it('the second item should be the third item of the original array', () => {
			expect(result[1]).toBe(three);
		});
	});

	describe('without any null or undefined items', () => {
		let items;
		let result;

		let one;
		let two;
		let three;
		let four;

		beforeEach((done) => {
			processor.process(items = [ one ='hello', two = [], three = { }, four = 4 ])
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the result not be the original array', () => {
			expect(result).not.toBe(items);
		});

		it('the result should have four items', () => {
			expect(result.length).toEqual(4);
		});

		it('the first item should be the first item of the original array', () => {
			expect(result[0]).toBe(one);
		});

		it('the second item should be the second item of the original array', () => {
			expect(result[1]).toBe(two);
		});

		it('the third item should be the third item of the original array', () => {
			expect(result[2]).toBe(three);
		});

		it('the fourth item should be the fourth item of the original array', () => {
			expect(result[3]).toBe(four);
		});
	});
});