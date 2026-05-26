const EpochResultProcessor = require('./../../../../data/processors/EpochResultProcessor');

describe('When converting a date milliseconds using the EpochResultProcessor', () => {
	'use strict';

	let processor;

	beforeEach(() => {
		processor = new EpochResultProcessor({ });
	});

	describe('and a date is passed', () => {
		let result;
		let now;

		beforeEach((done) => {
			processor.process(now = new Date()).then((r) => {
				result = r;

				done();
			});
		});

		it('should return a number', () => {
			expect(typeof result).toEqual('number');
		});

		it('the number should have the correct value', () => {
			expect(result).toEqual(now.getTime());
		});
	});
});