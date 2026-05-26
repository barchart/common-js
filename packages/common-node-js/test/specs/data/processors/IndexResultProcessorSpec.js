const IndexResultProcessor = require('./../../../../data/processors/IndexResultProcessor');

describe('When a IndexResultProcessor is used to index an array of word definitions', () => {
	'use strict';

	let processor;

	beforeEach(() => {
		processor = new IndexResultProcessor({ keyPropertyName: 'word' });
	});

	describe('having definitions for coffee, tea, and milk', () => {
		let items;

		let coffee;
		let tea;
		let milk;

		let result;

		beforeEach((done) => {
			processor.process(items = [ coffee = { word: 'coffee', definition: 'A drink made from beans' }, tea = { word: 'tea', definition: 'A drink made from leaves' }, milk = { word: 'milk', definition: 'A drink made from cows' } ])
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the result should be an object', () => {
			expect(typeof result).toEqual('object');
		});

			it("the result's coffee property should be the coffee object", () => {
			expect(result.coffee).toBe(coffee);
		});

			it("the result's tea property should be the tea object", () => {
			expect(result.tea).toBe(tea);
		});

		it("the result's milk property should be the milk object", () => {
			expect(result.milk).toBe(milk);
		});
	});
});
