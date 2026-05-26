const ConcatenateResultProcessor = require('./../../../../data/processors/ConcatenateResultProcessor');

describe('When a ConcatenateResultProcessor is created with the following source pattern [ "name.first", " The Great" ]', () => {
	'use strict';

	let processor;

	beforeEach(() => {
		processor = new ConcatenateResultProcessor({ propertyName: 'name.full', source: [ 'name.first', ' The Great' ] });
	});

	describe('and an object with a "name.first" property is processed', () => {
		let result;
		let original;

		beforeEach((done) => {
			processor.process(original = { name: { first: 'Bryan' } })
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the original object should be returned', () => {
			expect(result).toBe(original);
		});

		it('the "name.first" property should be unchanged', () => {
			expect(result.name.first).toEqual('Bryan');
		});

		it('the a "name.full" property should be added', () => {
			expect(result.name.hasOwnProperty('full')).toEqual(true);
		});

		it('the "name.full" property value should equal "Bryan The Great"', () => {
			expect(result.name.full).toEqual("Bryan The Great");
		});
	});

	describe('and an object without a "name.first" property is processed', () => {
		let result;
		let original;

		beforeEach((done) => {
			processor.process(original = { name: { last: 'Ingle' } })
				.then((r) => {
					result = r;
					done();
				});
		});

		it('the original object should be returned', () => {
			expect(result).toBe(original);
		});

		it('the a "name.full" property should be added', () => {
			expect(result.name.hasOwnProperty('full')).toEqual(true);
		});

		it('the "name.full" property value should equal "Bryan The Great"', () => {
			expect(result.name.full).toEqual("name.first The Great");
		});
	});
});