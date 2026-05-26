const MultiplyResultProcessor = require('./../../../../data/processors/MultiplyResultProcessor');

describe('When a MultiplyResultProcessor is created, using a right reference', () => {
	'use strict';

	let processor;

	beforeEach(() => {
		processor = new MultiplyResultProcessor({ propertyName: 'distance', left: 60, rightRef: 'hours' });
	});

	describe('and an object with a non-zero right property is passed', () => {
		let result;
		let original;

		beforeEach((done) => {
			processor.process(original = { hours: 2 })
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the original object should be returned', () => {
			expect(result).toBe(original);
		});

		it('the original object should now have a "distance" property', () => {
			expect(result.hasOwnProperty('distance')).toEqual(true);
		});

		it('the "distance" property should be 120', () => {
			expect(result.distance).toEqual(120);
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

		it('the original object should not have a "distance" property', () => {
			expect(result.hasOwnProperty('distance')).toEqual(false);
		});
	});
});

describe('When a MultiplyResultProcessor is created, using a left reference', () => {
	'use strict';

	let processor;

	beforeEach(() => {
		processor = new MultiplyResultProcessor({ propertyName: 'distance', leftRef: 'milesPerHour', right: 2 });
	});

	describe('and an object with a non-zero left property is passed', () => {
		let result;
		let original;

		beforeEach((done) => {
			processor.process(original = { milesPerHour: 60 })
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the original object should be returned', () => {
			expect(result).toBe(original);
		});

		it('the original object should now have a "distance" property', () => {
			expect(result.hasOwnProperty('distance')).toEqual(true);
		});

		it('the "distance" property should be 120', () => {
			expect(result.distance).toEqual(120);
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

		it('the original object should not have a "distance" property', () => {
			expect(result.hasOwnProperty('distance')).toEqual(false);
		});
	});
});