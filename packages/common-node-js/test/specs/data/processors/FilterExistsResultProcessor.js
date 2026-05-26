const FilterExistsResultProcessor = require('./../../../../data/processors/FilterExistsResultProcessor');

describe('When a FilterExistsResultProcessor is created', () => {
	'use strict';

	let things;

	let cat;
	let fish;
	let human;

	beforeEach(() => {
		things = [
			cat = { animal: 'Cat', tail: 'Fluffy', paws: 'Scratchy' },
			fish = { animal: 'Fish', tail: 'Slimy' },
			human = { animal: 'Human', skin: 'Soft' }
		];
	});

	describe('and filtering for property existence', () => {
		describe('for things that have tails', () => {
			let processor;
			let result;

			beforeEach((done) => {
				processor = new FilterExistsResultProcessor({ conditions: [ { propertyName: 'tail' } ] });

				processor.process(things).then((r) => {
					result = r;

					done();
				});
			});

			it('a new array should be returned', () => {
				expect(result).not.toBe(things);
			});

			it('the new array should have two items', () => {
				expect(result.length).toEqual(2);
			});

			it('the first item should be the cat', () => {
				expect(result[0]).toBe(cat);
			});

			it('the second item should be the fish', () => {
				expect(result[1]).toBe(fish);
			});
		});
	});

	describe('and filtering for property absence', () => {
		describe('for things that have do not have tails', () => {
			let processor;
			let result;

			beforeEach((done) => {
				processor = new FilterExistsResultProcessor({ conditions: [ { propertyName: 'tail', inverse: true } ] });

				processor.process(things).then((r) => {
					result = r;

					done();
				});
			});

			it('a new array should be returned', () => {
				expect(result).not.toBe(things);
			});

			it('the new array should have one item', () => {
				expect(result.length).toEqual(1);
			});

			it('the first item should be the dinosaur', () => {
				expect(result[0]).toBe(human);
			});
		});
	});

	describe('and filtering for combinations of property property existance and absence', () => {
		describe('for things that have tails and do not have paws', () => {
			let processor;
			let result;

			beforeEach((done) => {
				processor = new FilterExistsResultProcessor({ conditions: [ { propertyName: 'tail'}, { propertyName: 'paws', inverse: true }  ] });

				processor.process(things).then((r) => {
					result = r;

					done();
				});
			});

			it('a new array should be returned', () => {
				expect(result).not.toBe(things);
			});

			it('the new array should have two items', () => {
				expect(result.length).toEqual(1);
			});

			it('the first item should be the fish', () => {
				expect(result[0]).toBe(fish);
			});
		});
	});
});