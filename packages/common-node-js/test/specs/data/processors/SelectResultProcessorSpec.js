const SelectResultProcessor = require('./../../../../data/processors/SelectResultProcessor');

describe('When a SelectResultProcessor is created, selecting properties "a" as "b" and "c" as "d"', () => {
	'use strict';

	let processor;

	beforeEach(() => {
		processor = new SelectResultProcessor({ properties: { a: 'b', c: 'd' }});
	});

	describe('and an object with properties "a" and "c" is processed', () => {
		let result;
		let input;

		beforeEach((done) => {
			processor.process(input = { a: { }, c: { }})
				.then((r) => {
					result = r;

					done();
				});
		});

			it('the result array should not be the same object', () => {
			expect(result).not.toBe(input);
		});

		it('the result "b" property should be the same as the input "a" property', () => {
			expect(result.b).toBe(input.a);
		});

		it('the result "d" property should be the same as the input "c" property', () => {
			expect(result.d).toBe(input.c);
		});
	});

	describe('and an an array of two items, both with properties "a" and "c" is processed', () => {
		let result;
		let input;

		beforeEach((done) => {
			processor.process(input = [ { a: { }, c: { } }, { a: { }, c: { } } ])
				.then((r) => {
					result = r;

					done();
				});
		});

			it('the selected result should not be the same object', () => {
			expect(result).not.toBe(input);
		});

		it('the result should have two items', () => {
			expect(result.length).toEqual(2);
		});


		it('the result should not be the same object', () => {
			expect(result).not.toBe(input);
		});

		it('the first result object should not be the first input object', () => {
			expect(result[0]).not.toBe(input[0]);
		});

		it('the second result object should not be the first second object', () => {
			expect(result[1]).not.toBe(input[1]);
		});

		it('on the first object, the result "b" property should be the same as the input "a" property', () => {
			expect(result[0].b).toBe(input[0].a);
		});

		it('on the first object, the result "d" property should be the same as the input "c" property', () => {
			expect(result[0].d).toBe(input[0].c);
		});

		it('on the second object, the result "b" property should be the same as the input "a" property', () => {
			expect(result[1].b).toBe(input[1].a);
		});

		it('on the second object, the result "d" property should be the same as the input "c" property', () => {
			expect(result[1].d).toBe(input[1].c);
		});
	});
});
