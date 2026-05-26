const JsonParseResultProcessor = require('./../../../../data/processors/JsonParseResultProcessor');

describe('When a valid JSON string, with a single property, is processed', () => {
	'use strict';

	let resultPromise;

	beforeEach(() => {
		let processor = new JsonParseResultProcessor();

		resultPromise = processor.process('{ "hi": "there" }');
	});

	it('the promised result be an object', (done) => {
		resultPromise.then((result) => {
			expect(typeof result).toEqual('object');

			done();
		});
	});

	it('the promised result should have the desired property', (done) => {
		resultPromise.then((result) => {
			expect(result.hasOwnProperty('hi')).toEqual(true);

			done();
		});
	});

	it('the promised result should have the correct property value', (done) => {
		resultPromise.then((result) => {
			expect(result.hi).toEqual('there');

			done();
		});
	});
});