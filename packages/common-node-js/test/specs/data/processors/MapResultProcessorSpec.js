const MapResultProcessor = require('./../../../../data/processors/MapResultProcessor');

describe('When a MapResultProcessor is created', () => {
	'use strict';

	let processor;

	beforeEach(() => {
		processor = new MapResultProcessor({targetPropertyName: 'letters', mapPropertyName: 'alphabet'});
	});

	describe('and an array of letters is passed', () => {
		let result;

		let original;

		let map;
		let letters;

		beforeEach((done) => {
			processor.process(original = {
				alphabet: map = {a: 'alpha', b: 'beta', c: 'charlie'},
				letters: letters = ['a', 'c', 'e']
			}).then((r) => {
				result = r;

				done();
			});
		});

		it('the original object should be returned', () => {
			expect(result).toBe(original);
		});

		it('the letters array should be a new array', () => {
			expect(result.letters).not.toBe(letters);
		});

		it('letters array should be the same size', () => {
			expect(result.letters.size).toEqual(letters.size);
		});

		it('the first letter should be mapped', () => {
			expect(result.letters[0]).toEqual('alpha');
		});

		it('the second letter should be mapped', () => {
			expect(result.letters[1]).toEqual('charlie');
		});

		it('the third letter should not be mapped', () => {
			expect(result.letters[2]).toEqual('e');
		});
	});
});