const JoinResultProcessor = require('./../../../../data/processors/JoinResultProcessor');

describe('When using the JoinResultProcessor a source array', () => {
	'use strict';

	describe('and the source and target properties both exist', () => {
		let context;
		let resultPromise;

		beforeEach(() => {
			let processor = new JoinResultProcessor({ target: 'myTarget', targetProperty: 'letter', source: 'mySource', sourceProperty: 'symbol', alias: 'other' });

			resultPromise = processor.process(context = {
				myTarget: [
					{ letter: 'a' },
					{ letter: 'b' },
					{ letter: 'a' }
				],
				mySource: [
					{ symbol: 'a', ascii: 97 },
					{ symbol: 'b', ascii: 98 }
				]
			});
		});

		it('the promised result be the target object', (done) => {
			resultPromise.then((result) => {
				expect(result).toBe(context.myTarget);

				done();
			});
		});

		it('an alias property, containing the joined data, should be found on each property', (done) => {
			resultPromise.then((result) => {
				expect(result[0].other).toBe(context.mySource[0]);
				expect(result[1].other).toBe(context.mySource[1]);
				expect(result[2].other).toBe(context.mySource[0]);

				done();
			});
		});
	});

	describe('and the target property is missing (i.e. does not exist, has an "undefined" value, or has a "null" value)', () => {
		let context;
		let resultPromise;

		beforeEach(() => {
			let processor = new JoinResultProcessor({ target: 'myTarget', targetProperty: 'missing', source: 'mySource', sourceProperty: 'symbol', alias: 'other' });

			resultPromise = processor.process(context = {
				myTarget: [
					{ letter: 'a' },
					{ letter: 'b', missing: null },
					{ letter: 'a', missing: undefined }
				],
				mySource: [
					{ symbol: 'a', ascii: 97 },
					{ symbol: 'b', ascii: 98 }
				]
			});
		});

		it('the promised result be the target object', (done) => {
			resultPromise.then((result) => {
				expect(result).toBe(context.myTarget);

				done();
			});
		});

		it('an alias property, having an "undefined" value, should be found on each property', (done) => {
			resultPromise.then((result) => {
				expect(result[0].other).toBe(undefined);
				expect(result[1].other).toBe(undefined);
				expect(result[2].other).toBe(undefined);

				done();
			});
		});
	});

	describe('and the source property does not exist', () => {
		let context;
		let resultPromise;

		beforeEach(() => {
			let processor = new JoinResultProcessor({ target: 'myTarget', targetProperty: 'letter', source: 'mySource', sourceProperty: 'symbol', alias: 'other' });

			resultPromise = processor.process(context = {
				myTarget: [
					{ letter: 'x' },
					{ letter: 'y' },
					{ letter: 'z' }
				],
				mySource: [
					{ symbol: 'a', ascii: 97 },
					{ symbol: 'b', ascii: 98 }
				]
			});
		});

		it('the promised result be the target object', (done) => {
			resultPromise.then((result) => {
				expect(result).toBe(context.myTarget);

				done();
			});
		});

		it('an alias property, having an "undefined" value, should be found on each property', (done) => {
			resultPromise.then((result) => {
				expect(result[0].other).toBe(undefined);
				expect(result[1].other).toBe(undefined);
				expect(result[2].other).toBe(undefined);

				done();
			});
		});
	});
});

describe('When using the JoinResultProcessor with a source map', () => {
	'use strict';

	describe('and the target property exists with a matching source entry', () => {
		let context;
		let resultPromise;

		beforeEach(() => {
			let processor = new JoinResultProcessor({ target: 'myTarget', targetProperty: 'letter', source: 'ascii', sourceProperty: 'symbol', alias: 'code' });

			resultPromise = processor.process(context = {
				myTarget: [
					{ letter: 'a' },
					{ letter: 'b' },
					{ letter: 'a' }
				],
				ascii: {
					a: 97,
					b: 98
				}
			});
		});

		it('the promised result be the target object', (done) => {
			resultPromise.then((result) => {
				expect(result).toBe(context.myTarget);

				done();
			});
		});

		it('an alias property, containing the joined data, should be found on each property', (done) => {
			resultPromise.then((result) => {
				expect(result[0].code).toBe(97);
				expect(result[1].code).toBe(98);
				expect(result[2].code).toBe(97);

				done();
			});
		});
	});

	describe('and the target property is missing (i.e. does not exist, has an "undefined" value, or has a "null" value)', () => {
		let context;
		let resultPromise;

		beforeEach(() => {
			let processor = new JoinResultProcessor({ target: 'myTarget', targetProperty: 'missing', source: 'ascii', sourceProperty: 'symbol', alias: 'code' });

			resultPromise = processor.process(context = {
				myTarget: [
					{ letter: 'a' },
					{ letter: 'b', missing: null },
					{ letter: 'a', missing: undefined }
				],
				ascii: {
					a: 97,
					b: 98
				}
			});
		});

		it('the promised result be the target object', (done) => {
			resultPromise.then((result) => {
				expect(result).toBe(context.myTarget);

				done();
			});
		});

		it('an alias property, having an "undefined" value, should be found on each property', (done) => {
			resultPromise.then((result) => {
				expect(result[0].other).toBe(undefined);
				expect(result[1].other).toBe(undefined);
				expect(result[2].other).toBe(undefined);

				done();
			});
		});
	});

	describe('and the source entry does not exist', () => {
		let context;
		let resultPromise;

		beforeEach(() => {
			let processor = new JoinResultProcessor({ target: 'myTarget', targetProperty: 'missing', source: 'ascii', sourceProperty: 'symbol', alias: 'code' });

			resultPromise = processor.process(context = {
				myTarget: [
					{ letter: 'x' },
					{ letter: 'y' },
					{ letter: 'z' }
				],
				ascii: {
					a: 97,
					b: 98
				}
			});
		});

		it('the promised result be the target object', (done) => {
			resultPromise.then((result) => {
				expect(result).toBe(context.myTarget);

				done();
			});
		});

		it('an alias property, having an "undefined" value, should be found on each property', (done) => {
			resultPromise.then((result) => {
				expect(result[0].other).toBe(undefined);
				expect(result[1].other).toBe(undefined);
				expect(result[2].other).toBe(undefined);

				done();
			});
		});
	});





});