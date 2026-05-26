const JsonStringifyResultProcessor = require('./../../../../data/processors/JsonStringifyResultProcessor');

describe('When a simple object is serialized', () => {
	'use strict';

	let resultPromise;

	beforeEach(() => {
		let processor = new JsonStringifyResultProcessor();

		resultPromise = processor.process({ hi: 'there' });
	});

	it('the promised result should be correct', (done) => {
		resultPromise.then((result) => {
			expect(result).toEqual('{"hi":"there"}');

			done();
		});
	});
});