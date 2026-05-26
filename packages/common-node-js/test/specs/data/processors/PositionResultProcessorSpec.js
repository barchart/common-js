const PositionResultProcessor = require('./../../../../data/processors/PositionResultProcessor');

describe('When a PositionResultProcessor on an array', () => {
	'use strict';

	let processor;

	beforeEach(() => {
		processor = new PositionResultProcessor({propertyName: 'counter'});
	});

	describe('with two items', () => {
		let result;
		let original;

		beforeEach((done) => {
			processor.process(original = [{a: 1}, {b: 2}])
				.then((r) => {
					result = r;
					done();
				});
		});

		it('a new array is returned', () => {
			expect(result).not.toBe(original);
		});

		it('a new array has two items', () => {
			expect(result.length).toEqual(2);
		});

		it('the first item should the the first item in the original array', () => {
			expect(result[0]).toBe(original[0]);
		});

		it('the second item should the the second item in the original array', () => {
			expect(result[1]).toBe(original[1]);
		});

		it('the first item should have a "counter" property of zero', () => {
			expect(result[0].counter).toEqual(0);
		});

		it('the second item should have a "counter" property of one', () => {
			expect(result[1].counter).toEqual(1);
		});
	});
});
