let DivideResultProcessor = require('./../../../../data/processors/DivideResultProcessor');

describe('When a DivideResultProcessor is created, using a denominator reference', () => {
	'use strict';

	let processor;

	beforeEach(() => {
		processor = new DivideResultProcessor({ propertyName: 'milesPerHour', numerator: 120, denominatorRef: 'hours' });
	});

	describe('and an object with a non-zero denominator property is passed', () => {
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

		it('the original object should now have a "milesPerHour" property', () => {
			expect(result.hasOwnProperty('milesPerHour')).toEqual(true);
		});

		it('the "milesPerHour" property should be 60', () => {
			expect(result.milesPerHour).toEqual(60);
		});
	});

	describe('and an object with a zero denominator property is passed', () => {
		let result;
		let original;

		beforeEach((done) => {
			processor.process(original = { hours: 0 })
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the original object should be returned', () => {
			expect(result).toBe(original);
		});

		it('the original object should not have a "milesPerHour" property', () => {
			expect(result.hasOwnProperty('milesPerHour')).toEqual(false);
		});
	});

	describe('and an object without the denominator property is passed', () => {
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

		it('the original object should not have a "milesPerHour" property', () => {
			expect(result.hasOwnProperty('milesPerHour')).toEqual(false);
		});
	});
});

describe('When a DivideResultProcessor is created, using a numerator reference', () => {
	'use strict';

	let processor;

	beforeEach(() => {
		processor = new DivideResultProcessor({ propertyName: 'milesPerHour', numeratorRef: 'miles', denominator: 2 });
	});

	describe('and an object with a non-zero numerator property is passed', () => {
		let result;
		let original;

		beforeEach((done) => {
			processor.process(original = { miles: 120 })
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the original object should be returned', () => {
			expect(result).toBe(original);
		});

		it('the original object should now have a "milesPerHour" property', () => {
			expect(result.hasOwnProperty('milesPerHour')).toEqual(true);
		});

		it('the "milesPerHour" property should be 60', () => {
			expect(result.milesPerHour).toEqual(60);
		});
	});

	describe('and an object with a zero numerator property is passed', () => {
		let result;
		let original;

		beforeEach((done) => {
			processor.process(original = { miles: 0 })
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the original object should be returned', () => {
			expect(result).toBe(original);
		});

		it('the original object should now have a "milesPerHour" property', () => {
			expect(result.hasOwnProperty('milesPerHour')).toEqual(true);
		});

		it('the "milesPerHour" property should be 0', () => {
			expect(result.milesPerHour).toEqual(0);
		});
	});

	describe('and an object without the numerator property is passed', () => {
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

		it('the original object should not have a "milesPerHour" property', () => {
			expect(result.hasOwnProperty('milesPerHour')).toEqual(false);
		});
	});
});

describe('When a DivideResultProcessor is created, repeating the operation multiple times', () => {
	'use strict';

	let processor;

	beforeEach(() => {
		processor = new DivideResultProcessor({ items: [ { propertyName: 'a', numeratorRef: 'a', denominatorRef: 'b' }, { propertyName: 'a', numeratorRef: 'a', denominatorRef: 'b' } ] });
	});

	describe('and an object with a non-zero numerator property is passed', () => {
		let result;
		let original;

		beforeEach((done) => {
			processor.process(original = { a: 2000, b: 10 })
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the original object should be returned', () => {
			expect(result).toBe(original);
		});

		it('the "a" property should be the result dividing the "a" property by the "b" property twice', () => {
			expect(result.a).toEqual(20);
		});
	});
});