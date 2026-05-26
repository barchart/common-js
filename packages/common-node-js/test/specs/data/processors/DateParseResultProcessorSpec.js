let DateParseResultProcessor = require('./../../../../data/processors/DateParseResultProcessor');

describe('When parsing a date using the DateResultParser', () => {
	'use strict';

	let processor;

	beforeEach(() => {
		processor = new DateParseResultProcessor({ dateRef: 'd' });
	});

	describe('a date string formatted as yyyy-MM-dd hh:mm:ss is processed', () => {
		let result;

		beforeEach((done) => {
			processor.process({
				d: '2017-10-31 23:59:59'
			}).then((r) => {
				result = r;

				done();
			});
		});

		it('should return the a date instance', () => {
			expect(result instanceof Date).toEqual(true);
		});

		it('the date should have the correct value', () => {
			expect(result.getTime()).toEqual((new Date(2017, 9, 31, 23, 59, 59)).getTime());
		});
	});
});