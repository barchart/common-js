const SumResultProcessor = require('./../../../../data/processors/SumResultProcessor');

describe('When a SumResultProcessor is used to process an array of objects', () => {
	'use strict';

	let processor;

	beforeEach(() => {
		processor = new SumResultProcessor({ propertyName: 'a' });
	});

	describe('where each item has a numeric property', () => {
		let items;
		let result;

		beforeEach((done) => {
			processor.process(items = [ { a: 2 }, { a: 3 }, { a: 5 } ])
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the result should be a number', () => {
			expect(typeof result).toEqual('number');
		});

		it('the result should be the correct sum', () => {
			expect(result).toEqual(10);
		});
	});

	describe('where an item is missing the numeric property', () => {
		let items;
		let result;

		beforeEach((done) => {
			processor.process(items = [ { a: 2 }, { a: 3 }, { b: 5 } ])
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the result should be null', () => {
			expect(result).toEqual(null);
		});
	});
});

describe('When a SumResultProcessor is used to process an array of numbers', () => {
	'use strict';

	let processor;

	beforeEach(() => {
		processor = new SumResultProcessor({ });
	});

	describe('where each item is numeric', () => {
		let items;
		let result;

		beforeEach((done) => {
			processor.process(items = [ 2, 3, 5 ])
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the result should be a number', () => {
			expect(typeof result).toEqual('number');
		});

		it('the result should be the correct sum', () => {
			expect(result).toEqual(10);
		});
	});

	describe('where an item is not numeric property', () => {
		let items;
		let result;

		beforeEach((done) => {
			processor.process(items = [ 2, null, 5 ])
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the result should be null', () => {
			expect(result).toEqual(null);
		});
	});
});

describe('When a SumResultProcessor is used process a zero-length array', () => {
	'use strict';

	let processor;

	beforeEach(() => {
		processor = new SumResultProcessor({ });
	});

	describe('where each item is numeric', () => {
		let items;
		let result;

		beforeEach((done) => {
			processor.process(items = [ ])
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the result should be a number', () => {
			expect(typeof result).toEqual('number');
		});

		it('the result should be the correct sum', () => {
			expect(result).toEqual(0);
		});
	});
});