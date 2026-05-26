const SubtractResultProcessor = require('./../../../../data/processors/SubtractResultProcessor');

describe('When a SubtractResultProcessor is created, using a right reference', () => {
	'use strict';

	let processor;

	beforeEach(() => {
		processor = new SubtractResultProcessor({ propertyName: 'difference', left: 1, rightRef: 'right' });
	});

	describe('and an object with a non-zero right property is passed', () => {
		let result;
		let original;

		beforeEach((done) => {
			processor.process(original = { right: 2 })
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the original object should be returned', () => {
			expect(result).toBe(original);
		});

		it('the original object should now have a "difference" property', () => {
			expect(result.hasOwnProperty('difference')).toEqual(true);
		});

		it('the "difference" property should be -1', () => {
			expect(result.difference).toEqual(-1);
		});
	});

	describe('and an object without the right property is passed', () => {
		let result;
		let original;

		beforeEach((done) => {
			processor.process(original = { })
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the original object should be returned', () => {
			expect(result).toBe(original);
		});

		it('the original object should not have a "difference" property', () => {
			expect(result.hasOwnProperty('difference')).toEqual(false);
		});
	});
});

describe('When a SubtractResultProcessor is created, using a left reference', () => {
	'use strict';

	let processor;

	beforeEach(() => {
		processor = new SubtractResultProcessor({ propertyName: 'difference', leftRef: 'left', right: 2 });
	});

	describe('and an object with a non-zero left property is passed', () => {
		let result;
		let original;

		beforeEach((done) => {
			processor.process(original = { left: 1 })
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the original object should be returned', () => {
			expect(result).toBe(original);
		});

		it('the original object should now have a "difference" property', () => {
			expect(result.hasOwnProperty('difference')).toEqual(true);
		});

		it('the "difference" property should be -1', () => {
			expect(result.difference).toEqual(-1);
		});
	});

	describe('and an object without the left property is passed', () => {
		let result;
		let original;

		beforeEach((done) => {
			processor.process(original = { })
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the original object should be returned', () => {
			expect(result).toBe(original);
		});

		it('the original object should not have a "difference" property', () => {
			expect(result.hasOwnProperty('difference')).toEqual(false);
		});
	});
});