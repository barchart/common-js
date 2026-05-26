const AverageResultProcessor = require('./../../../../data/processors/AverageResultProcessor');

describe('When a AverageResultProcessor is used to process an array of objects', () => {
	'use strict';

	let processor;

	beforeEach(() => {
		processor = new AverageResultProcessor({ propertyName: 'a' });
	});

	describe('where each item has a numeric property', () => {
		let items;
		let result;

		beforeEach((done) => {
			processor.process(items = [ { a: 5 }, { a: 15 }, { a: 40 } ])
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the result should be a number', () => {
			expect(typeof result).toEqual('number');
		});

		it('the result should be the correct average', () => {
			expect(result).toEqual(20);
		});
	});

	describe('where an item is missing the numeric property', () => {
		let items;
		let result;

		beforeEach((done) => {
			processor.process(items = [ { a: 5 }, { a: 15 }, { b: 40 } ])
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

describe('When a AverageResultProcessor is used to process an array of numbers', () => {
	'use strict';

	let processor;

	beforeEach(() => {
		processor = new AverageResultProcessor({ });
	});

	describe('where each item is numeric', () => {
		let items;
		let result;

		beforeEach((done) => {
			processor.process(items = [ 5, 15, 40 ])
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the result should be a number', () => {
			expect(typeof result).toEqual('number');
		});

		it('the result should be the correct sum', () => {
			expect(result).toEqual(20);
		});
	});

	describe('where an item is not numeric property', () => {
		let items;
		let result;

		beforeEach((done) => {
			processor.process(items = [ 5, 15, null ])
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

describe('When a AverageResultProcessor is used to process an array of strings', () => {
	'use strict';

	let processor;

	beforeEach(() => {
		processor = new AverageResultProcessor({ });
	});

	describe('where each item is can be converted to a number', () => {
		let items;
		let result;

		beforeEach((done) => {
			processor.process(items = [ "5", "15", "40" ])
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the result should be a number', () => {
			expect(typeof result).toEqual('number');
		});

		it('the result should be the correct sum', () => {
			expect(result).toEqual(20);
		});
	});

	describe('where an item cannot be converted to a number', () => {
		let items;
		let result;

		beforeEach((done) => {
			processor.process(items = [ 5, 'fifteen', 40 ])
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