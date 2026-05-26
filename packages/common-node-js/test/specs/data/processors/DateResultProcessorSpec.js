const DateResultProcessor = require('./../../../../data/processors/DateResultProcessor');

describe('When getting the start of the month (using references)', () => {
	'use strict';

	let processor;

	beforeEach(() => {
		processor = new DateResultProcessor({ yearRef: 'y', monthRef: 'm', start: 'month' });
	});

	describe('and a context, with the referenced properties, is passed', () => {
		let result;

		beforeEach((done) => {
			processor.process({
				m: 11,
				y: 2017
			}).then((r) => {
				result = r;

				done();
			});
		});

		it('should return the a date instance', () => {
			expect(result instanceof Date).toEqual(true);
		});

		it('the date should have the correct value', () => {
			expect(result.getTime()).toEqual((new Date(2017, 11, 1)).getTime());
		});
	});
});

describe('When getting the end of the month (using references)', () => {
	'use strict';

	let processor;

	beforeEach(() => {
		processor = new DateResultProcessor({ yearRef: 'y', monthRef: 'm', end: 'month' });
	});

	describe('and a context, with the referenced properties, is passed', () => {
		let result;

		beforeEach((done) => {
			processor.process({
				m: 11,
				y: 2017
			}).then((r) => {
				result = r;

				done();
			});
		});

		it('should return the a date instance', () => {
			expect(result instanceof Date).toEqual(true);
		});

		it('the date should have the correct value', () => {
			expect(result.getTime()).toEqual((new Date(2017, 11, 31, 23, 59, 59, 999)).getTime());
		});
	});
});