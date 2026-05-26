const TreePathResultProcessor = require('./../../../../data/processors/TreeResultProcessor');

describe('When a TreePathResultProcessor is used to group animals (using a static path)', () => {
	'use strict';

	let processor;

	beforeEach(() => {
		processor = new TreePathResultProcessor({ pathPropertyName: 'taxonomy' });
	});

	describe('with types of dogs', () => {
		let arcticFox;
		let redFox;
		let coyote;

		let items;
		let result;

		beforeEach((done) => {
			processor.process(items = [
				arcticFox = {
					taxonomy: [
						'Canidae',
						'Vulpes'
					],
					species: 'V. lagopus',
					commonName: 'Arctic Fox'
				},
				redFox = {
					taxonomy: [
						'Canidae',
						'Vulpes'
					],
					species: 'V. vulpes',
					commonName: 'Red Fox'
				},
				coyote = {
					taxonomy: [
						'Canidae',
						'Canis'
					],
					species: 'C. latrans',
					commonName: 'Coyote'
				}
			]).then((r) => {
				result = r;

				done();
			});
		});

		it('the result should be an object', () => {
			expect(typeof result).toEqual('object');
		});

		it('the first family should have one item', () => {
			expect(result.children.length).toEqual(1);
		});

		it('the first family should be Canidae', () => {
			let canidae = result.children[0];

			expect(canidae.name).toEqual('Canidae');
		});

		it('the first family should have not have any items', () => {
			let canidae = result.children[0];

			expect(canidae.hasOwnProperty('items')).toEqual(false);
		});

		it('the Candidae fmaily should be have two genus children', () => {
			let canidae = result.children[0];

			expect(canidae.children.length).toEqual(2);
		});

		it('the Canidae family should contain the Vulpes genus', () => {
			let canidae = result.children[0];

			expect(canidae.children.some(s => s.name === 'Vulpes')).toEqual(true);
		});

		it('the Vulpes genus should have two items', () => {
			let canidae = result.children[0];
			let vulpes = canidae.children.find(s => s.name === 'Vulpes');

			expect(vulpes.items.length).toEqual(2);
		});

		it('the Vulpes genus should have an item for the Arctic Fox', () => {
			let canidae = result.children[0];
			let vulpes = canidae.children.find(s => s.name === 'Vulpes');

			expect(vulpes.items.find(x => x.species === 'V. lagopus')).toBe(arcticFox);
		});

		it('the Vulpes genus should have an item for the Red Fox', () => {
			let canidae = result.children[0];
			let vulpes = canidae.children.find(s => s.name === 'Vulpes');

			expect(vulpes.items.find(x => x.species === 'V. vulpes')).toBe(redFox);
		});

		it('the Canidae family should contain the Canis genus', () => {
			let canidae = result.children[0];

			expect(canidae.children.some(s => s.name === 'Canis')).toEqual(true);
		});

		it('the Canis genus should have one item', () => {
			let canidae = result.children[0];
			let canis = canidae.children.find(s => s.name === 'Canis');

			expect(canis.items.length).toEqual(1);
		});

		it('the Canis genus should have an item for the Coyote', () => {
			let canidae = result.children[0];
			let canis = canidae.children.find(s => s.name === 'Canis');

			expect(canis.items.find(x => x.species === 'C. latrans')).toBe(coyote);
		});
	});
});

describe('When a TreePathResultProcessor is used to group animals (using a dynamic path)', () => {
	'use strict';

	let processor;

	beforeEach(() => {
		processor = new TreePathResultProcessor({ pathPropertyNames: [ 'family', 'genus'] });
	});

	describe('with types of dogs', () => {
		let arcticFox;
		let redFox;
		let coyote;

		let items;
		let result;

		beforeEach((done) => {
			processor.process(items = [
				arcticFox = {
					family: 'Canidae',
					genus: 'Vulpes',
					species: 'V. lagopus',
					commonName: 'Arctic Fox'
				},
				redFox = {
					family: 'Canidae',
					genus: 'Vulpes',
					species: 'V. vulpes',
					commonName: 'Red Fox'
				},
				coyote = {
					family: 'Canidae',
					genus: 'Canis',
					species: 'C. latrans',
					commonName: 'Coyote'
				}
			]).then((r) => {
				result = r;

				done();
			});
		});

		it('the result should be an object', () => {
			expect(typeof result).toEqual('object');
		});

		it('the first family should have one item', () => {
			expect(result.children.length).toEqual(1);
		});

		it('the first family should be Canidae', () => {
			let canidae = result.children[0];

			expect(canidae.name).toEqual('Canidae');
		});

		it('the first family should have not have any items', () => {
			let canidae = result.children[0];

			expect(canidae.hasOwnProperty('items')).toEqual(false);
		});

		it('the Candidae fmaily should be have two genus children', () => {
			let canidae = result.children[0];

			expect(canidae.children.length).toEqual(2);
		});

		it('the Canidae family should contain the Vulpes genus', () => {
			let canidae = result.children[0];

			expect(canidae.children.some(s => s.name === 'Vulpes')).toEqual(true);
		});

		it('the Vulpes genus should have two items', () => {
			let canidae = result.children[0];
			let vulpes = canidae.children.find(s => s.name === 'Vulpes');

			expect(vulpes.items.length).toEqual(2);
		});

		it('the Vulpes genus should have an item for the Arctic Fox', () => {
			let canidae = result.children[0];
			let vulpes = canidae.children.find(s => s.name === 'Vulpes');

			expect(vulpes.items.find(x => x.species === 'V. lagopus')).toBe(arcticFox);
		});

		it('the Vulpes genus should have an item for the Red Fox', () => {
			let canidae = result.children[0];
			let vulpes = canidae.children.find(s => s.name === 'Vulpes');

			expect(vulpes.items.find(x => x.species === 'V. vulpes')).toBe(redFox);
		});

		it('the Canidae family should contain the Canis genus', () => {
			let canidae = result.children[0];

			expect(canidae.children.some(s => s.name === 'Canis')).toEqual(true);
		});

		it('the Canis genus should have one item', () => {
			let canidae = result.children[0];
			let canis = canidae.children.find(s => s.name === 'Canis');

			expect(canis.items.length).toEqual(1);
		});

		it('the Canis genus should have an item for the Coyote', () => {
			let canidae = result.children[0];
			let canis = canidae.children.find(s => s.name === 'Canis');

			expect(canis.items.find(x => x.species === 'C. latrans')).toBe(coyote);
		});
	});
});

