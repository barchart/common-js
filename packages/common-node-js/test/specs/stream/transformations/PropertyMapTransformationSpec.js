const PropertyMapTransformation = require('./../../../../stream/transformations/PropertyMapTransformation');

describe('When a PropertyMapTransformation is created', () => {
	'use strict';

	describe('targeting the "letter" property (without renaming)', () => {
		describe('with a map of characters to ascii values (a, b, and c)', () => {
			let map;
			let transformation;

			beforeEach(() => {
				map = new Map();

				map.set('a', 97);
				map.set('b', 98);
				map.set('c', 99);

				transformation = new PropertyMapTransformation('letter', map);
			});

			it('the transformation checked on an empty object should fail', () => {
				expect(transformation.canTransform({})).toEqual(false);
			});

			it('the transformation invocation on an empty object should throw', () => {
				expect(() => { transformation.transform({}); }).toThrow();
			});

			it('the transformation checked on { "letter": "c" } should succeed', () => {
				expect(transformation.canTransform({letter: 'c'})).toEqual(true);
			});

			it('the transformation invocation on { "letter": "c" } should change the "letter" value to 99', () => {
				expect(transformation.transform({letter: 'c'}).letter).toEqual(99);
			});

			it('the transformation checked on { "letter": "d" } should fail', () => {
				expect(transformation.canTransform({letter: 'd'})).toEqual(false);
			});

			it('the transformation invocation on { "letter": "c" } should throw', () => {
				expect(() => { transformation.transform({letter: 'd'}); }).toThrow();
			});
		});
	});

	describe('targeting the "letter" property (with renaming to "letterCode")', () => {
		describe('with a map of characters to ascii values (a, b, and c)', () => {
			let map;
			let transformation;

			beforeEach(() => {
				map = new Map();

				map.set('a', 97);
				map.set('b', 98);
				map.set('c', 99);

				transformation = new PropertyMapTransformation('letter', map, 'letterCode');
			});

			describe('and the transformation is invoked on { "letter": "c" }', () => {
				let target;
				let result;

				beforeEach(() => {
					result = transformation.transform(target = {letter: 'c'});
				});

				it('the results should be the same object', () => {
					expect(result).toBe(target);
				});

				it('the "letter" property should remain unchanged', () => {
					expect(result.letter).toEqual('c');
				});

				it('the "letterCode" property should remain unchanged', () => {
					expect(result.letterCode).toEqual(99);
				});
			});
		});
	});
});