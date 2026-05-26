const FlattenResultProcessor = require('./../../../../data/processors/FlattenResultProcessor');

describe('When a FlattenResultProcessor is created', () => {
	'use strict';

	let processor;

	beforeEach(() => {
		processor = new FlattenResultProcessor();
	});

	describe('and a null value is processed', () => {
		let result;

		beforeEach((done) => {
			processor.process(null)
				.then((r) => {
					result = r;

					done();
				});
		});

		it('an array should be returned', () => {
			expect(result instanceof Array).toEqual(true);
		});

		it('the array should have zero items', () => {
			expect(result.length).toEqual(0);
		});
	});

	describe('and an undefined value is processed', () => {
		let result;

		beforeEach((done) => {
			processor.process()
				.then((r) => {
					result = r;

					done();
				});
		});

		it('an array should be returned', () => {
			expect(result instanceof Array).toEqual(true);
		});

		it('the array should have zero items', () => {
			expect(result.length).toEqual(0);
		});
	});

	describe('and an array with three items is passed', () => {
		let input;

		let one;
		let two;
		let three;
		let four;
		let five;

		let result;

		beforeEach((done) => {
			input = [
				[
					one = 1,
					two = 2
				],
				[
					three = 3,
					four = 4
				],
				[
					five = 5
				]
			];

			result = processor.process(input)
				.then((r) => {
					result = r;

					done();
				});
		});

		it('an array should be returned', () => {
			expect(result instanceof Array).toEqual(true);
		});

		it('the array should five items', () => {
			expect(result.length).toEqual(5);
		});

		it('the first item should be one', () => {
			expect(result[0]).toEqual(one);
		});

		it('the second item should be two', () => {
			expect(result[1]).toEqual(two);
		});

		it('the third item should be three', () => {
			expect(result[2]).toEqual(three);
		});

		it('the fourth item should be four', () => {
			expect(result[3]).toEqual(four);
		});

		it('the fifth item should be five', () => {
			expect(result[4]).toEqual(five);
		});
	});
});