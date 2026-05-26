const DistinctResultProcessor = require('./../../../../data/processors/DistinctResultProcessor');

describe('When a DistinctResultProcessor is created and "wrapping" is desired', () => {
	'use strict';

	let processor;

	beforeEach(() => {
		processor = new DistinctResultProcessor({property: 'firstName', wrap: true});
	});

	describe('and used to extract unique first names', () => {
		let result;

		let original;

		beforeEach((done) => {
			processor.process(original = [ { firstName: 'Bill', lastName: 'Clinton'}, { firstName: 'Bill', lastName: 'Moyers'}, { firstName: 'Hillary', lastName: 'Clinton'} ]).then((r) => {
				result = r;

				done();
			});
		});

		it('the original object should not be returned', () => {
			expect(result).not.toBe(original);
		});

		it('the returned object should be an array', () => {
			expect(Array.isArray(result)).toEqual(true);
		});

		it('there should be two distinct first names', () => {
			expect(result.length).toEqual(2);
		});

		it('the first name should be "Bill"', () => {
			expect(result[0].firstName).toEqual('Bill');
		});

		it('the second name should be "Hillary"', () => {
			expect(result[1].firstName).toEqual('Hillary');
		});
	});
});

describe('When a DistinctResultProcessor is created and "wrapping" is not desired', () => {
	'use strict';

	let processor;

	beforeEach(() => {
		processor = new DistinctResultProcessor({property: 'firstName', wrap: false});
	});

	describe('and used to extract unique first names', () => {
		let result;

		let original;

		beforeEach((done) => {
			processor.process(original = [ { firstName: 'Bill', lastName: 'Clinton'}, { firstName: 'Bill', lastName: 'Moyers'}, { firstName: 'Hillary', lastName: 'Clinton'} ]).then((r) => {
				result = r;

				done();
			});
		});

		it('the original object should not be returned', () => {
			expect(result).not.toBe(original);
		});

		it('the returned object should be an array', () => {
			expect(Array.isArray(result)).toEqual(true);
		});

		it('there should be two distinct first names', () => {
			expect(result.length).toEqual(2);
		});

		it('the first name should be "Bill"', () => {
			expect(result[0]).toEqual('Bill');
		});

		it('the second name should be "Hillary"', () => {
			expect(result[1]).toEqual('Hillary');
		});
	});
});