const PushResultProcessor = require('./../../../../data/processors/PushResultProcessor');

describe('When a PushResultProcessor is created', () => {
	'use strict';

	let processor;

	beforeEach(() => {
		processor = new PushResultProcessor({ arrayPropertyName: 'spelling', itemPropertyName: 'letters.fifth'});
	});

	describe('and the array already exists', () => {
		let result;

		let original;
		let spelling;

		beforeEach((done) => {
			processor.process(original = {
				spelling: spelling = [ 'b', 'r', 'y', 'a' ],
				letters: {
					fifth: 'n'
				}
			}).then((r) => {
				result = r;

				done();
			});
		});

		it('the original object should be returned', () => {
			expect(result).toBe(original);
		});

		it('the original object array should be the same', () => {
			expect(result.spelling).toBe(spelling);
		});

		it('the "spelling" array should have a fifth item', () => {
			expect(result.spelling.length).toEqual(5);
		});

		it('the letter "n" should be the the fifth item in the "spelling" array', () => {
			expect(result.spelling[4]).toEqual('n');
		});
	});

	describe('and the array does not exist', () => {
		let result;

		let original;
		let spelling;

		beforeEach((done) => {
			processor.process(original = {
				letters: {
					fifth: 'n'
				}
			}).then((r) => {
				result = r;

				done();
			});
		});

		it('the original object should be returned', () => {
			expect(result).toBe(original);
		});

		it('the original object should now have a new "spelling" property', () => {
			expect(result.hasOwnProperty('spelling')).toEqual(true);
		});

		it('the new "spelling" property should be an array', () => {
			expect(Array.isArray(result.spelling)).toEqual(true);
		});

		it('the "spelling" array should have a one item', () => {
			expect(result.spelling.length).toEqual(1);
		});

		it('the letter "n" should be the the first item', () => {
			expect(result.spelling[0]).toEqual('n');
		});
	});
});