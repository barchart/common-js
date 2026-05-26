const FilterRegexResultProcessor = require('./../../../../data/processors/FilterRegexResultProcessor');

describe('When a FilterRegexResultProcessor is created', () => {
	'use strict';

	let pieces;

	let pawn;
	let king;
	let queen;
	let bishop;
	let knight;
	let rook;

	beforeEach(() => {
		pieces = [
			pawn = { name: 'pawn'},
			king = { name: 'king' },
			queen = { name: 'queen' },
			bishop = { name: 'bishop' },
			knight = { name: 'knight' },
			rook = { name: 'rook' }
		];
	});

	describe('and used to filter names of chess pieces that have consecutive vowels', () => {
		let processor;
		let result;

		beforeEach((done) => {
			processor = new FilterRegexResultProcessor({ conditions: [ { propertyName: 'name', expression:  '[aeiou]{2}' } ] });

			processor.process(pieces).then((r) => {
				result = r;

				done();
			});
		});

		it('a new array should be returned', () => {
			expect(result).not.toBe(pieces);
		});

		it('the new array should have two items', () => {
			expect(result.length).toEqual(2);
		});

		it('the first item should be the queen', () => {
			expect(result[0]).toBe(queen);
		});

		it('the second item should be the rook', () => {
			expect(result[1]).toBe(rook);
		});
	});

	describe('and used to filter names of chess pieces that have consecutive vowels and start with the letter q', () => {
		let processor;
		let result;

		beforeEach((done) => {
			processor = new FilterRegexResultProcessor({ conditions: [ { propertyName: 'name', expression:  '[aeiou]{2}' }, { propertyName: 'name', expression:  '^q' } ] });

			processor.process(pieces).then((r) => {
				result = r;

				done();
			});
		});

		it('a new array should be returned', () => {
			expect(result).not.toBe(pieces);
		});

		it('the new array should have one item', () => {
			expect(result.length).toEqual(1);
		});

		it('the first item should be the queen', () => {
			expect(result[0]).toBe(queen);
		});
	});

	describe('and used to filter names of chess pieces that do not have consecutive vowels', () => {
		let processor;
		let result;

		beforeEach((done) => {
			processor = new FilterRegexResultProcessor({ conditions: [ { propertyName: 'name', expression:  '[aeiou]{2}', inverse: true } ] });

			processor.process(pieces).then((r) => {
				result = r;

				done();
			});
		});

		it('a new array should be returned', () => {
			expect(result).not.toBe(pieces);
		});

		it('the new array should have two items', () => {
			expect(result.length).toEqual(4);
		});

		it('the first item should be the pawn', () => {
			expect(result[0]).toBe(pawn);
		});

		it('the second item should be the king', () => {
			expect(result[1]).toBe(king);
		});

		it('the third item should be the bishop', () => {
			expect(result[2]).toBe(bishop);
		});

		it('the fourth item should be the knight', () => {
			expect(result[3]).toBe(knight);
		});
	});
});