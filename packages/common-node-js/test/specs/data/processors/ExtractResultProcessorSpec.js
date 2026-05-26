const ExtractResultProcessor = require('./../../../../data/processors/ExtractResultProcessor');

describe('When a ExtractResultProcessor is created', () => {
	'use strict';

	let processor;
	let configuration;

	beforeEach(() => {
		processor = new ExtractResultProcessor(configuration = { propertyName: 'thing' });
	});

	describe('and an array with three items is passed', () => {
		let input;

		let one;
		let two;
		let three;

		let result;

		beforeEach((done) => {
			input = [
				{ thing: one = '1'},
				{ thing: two = '2'},
				{ thing:  three = '3'}
			];

			processor.process(input)
				.then((r) => {
					result = r;

					done();
				});
		});

		it('an array should be returned', () => {
			expect(result instanceof Array).toEqual(true);
		});

		it('the array should three items', () => {
			expect(result.length).toEqual(3);
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
	});
});