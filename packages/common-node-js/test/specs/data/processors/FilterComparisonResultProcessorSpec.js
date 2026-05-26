const FilterComparisonResultProcessor = require('./../../../../data/processors/FilterComparisonResultProcessor');

describe('When a FilterComparisonResultProcessor is created', () => {
	'use strict';

	let trees;

	let seed;
	let sapling;
	let sequoia;

	beforeEach(() => {
		trees = [
			seed = { age: 0, width: 0.01 },
			sapling = { age: 1, width: 0.1 },
			sequoia = { age: 3000, width: 10 }
		];
	});

	describe('and using a "greater than" filter with a hardcoded value', () => {
		let processor;
		let result;

		beforeEach((done) => {
			processor = new FilterComparisonResultProcessor({ conditions: [ { propertyName: 'age', value: 100, greater: true } ] });

			processor.process(trees).then((r) => {
				result = r;

				done();
			});
		});

		it('a new array should be returned', () => {
			expect(result).not.toBe(trees);
		});

		it('the new array should have one items', () => {
			expect(result.length).toEqual(1);
		});

		it('the first item should be the sequoia', () => {
			expect(result[0]).toBe(sequoia);
		});
	});

	describe('and using an inverse "greater than" filter with a hardcoded value', () => {
		let processor;
		let result;

		beforeEach((done) => {
			processor = new FilterComparisonResultProcessor({ conditions: [ { propertyName: 'age', value: 1, greater: true, inverse: true } ] });

			processor.process(trees).then((r) => {
				result = r;

				done();
			});
		});

		it('a new array should be returned', () => {
			expect(result).not.toBe(trees);
		});

		it('the new array should have one items', () => {
			expect(result.length).toEqual(2);
		});

		it('the first item should be the seed', () => {
			expect(result[0]).toBe(seed);
		});

		it('the first item should be the sapling', () => {
			expect(result[1]).toBe(sapling);
		});
	});
});