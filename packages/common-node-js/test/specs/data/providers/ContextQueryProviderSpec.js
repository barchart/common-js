const ContextQueryProvider = require('./../../../../data/providers/ContextQueryProvider');

describe('When running a ContextQueryProvider, configured read a single property', () => {
	'use strict';

	let processor;

	beforeEach(() => {
		processor = new ContextQueryProvider({ property: 'a.b.c' });
	});

	describe('and the property exists', () => {
		let context;
		let resultPromise;

		beforeEach(() => {
			resultPromise = processor.runQuery(context = { a: { b : { c: { } } } });
		});

		it('the promised result should match the context passed to the provider', (done) => {
			resultPromise.then((result) => {
				expect(result).toBe(context.a.b.c);

				done();
			});
		});
	});

	describe('and the property does not exist', () => {
		let context;
		let resultPromise;

		beforeEach(() => {
			resultPromise = processor.runQuery(context = { x: { y : { z: { } } } });
		});

		it('the promised result should match the context passed to the provider', (done) => {
			resultPromise.then((result) => {
				expect(result).toEqual(undefined);

				done();
			});
		});
	});
});

describe('When running a ContextQueryProvider, configured read two properties', () => {
	'use strict';

	let processor;

	beforeEach(() => {
		processor = new ContextQueryProvider({ properties: [ 'a', 'b' ] });
	});

	describe('and both properties exist', () => {
		let context;
		let resultPromise;

		beforeEach(() => {
			resultPromise = processor.runQuery(context = { a: { }, b: { } });
		});

		it('the promised result should have the first property', (done) => {
			resultPromise.then((result) => {
				expect(result.a).toBe(context.a);

				done();
			});
		});

		it('the promised result should have the second property', (done) => {
			resultPromise.then((result) => {
				expect(result.b).toBe(context.b);

				done();
			});
		});
	});

	describe('and the first property exists', () => {
		let context;
		let resultPromise;

		beforeEach(() => {
			resultPromise = processor.runQuery(context = { a: { } });
		});

		it('the promised result should have the first property', (done) => {
			resultPromise.then((result) => {
				expect(result.a).toBe(context.a);

				done();
			});
		});

		it('the promised result should not have the second property', (done) => {
			resultPromise.then((result) => {
				expect(result.hasOwnProperty(('b'))).toEqual(false);

				done();
			});
		});
	});
});

describe('When running a ContextQueryProvider, without specifying particular properties', () => {
	'use strict';

	let context;
	let resultPromise;

	beforeEach(() => {
		let processor = new ContextQueryProvider({ });

		resultPromise = processor.runQuery(context = { });
	});

	it('the promised result should match the context passed to the provider', (done) => {
		resultPromise.then((result) => {
			expect(result).toBe(context);

			done();
		});
	});
});