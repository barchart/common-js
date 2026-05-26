const FirstResultProcessor = require('./../../../../data/processors/FirstResultProcessor');

describe('When a FirstResultProcessor is created', () => {
	'use strict';

	let processor;

	beforeEach(() => {
		processor = new FirstResultProcessor();
	});

	describe('and an array with three values is passed', () => {
		let result;

		let original;

		let fa;
		let so;
		let la;

		beforeEach((done) => {
			processor.process(original = [ fa = {note: 'fa'}, so = {note: 'so'}, la = {note: 'la'}]).then((r) => {
				result = r;

				done();
			});
		});

		it('the "fa" object should be returned', () => {
			expect(result).toBe(fa);
		});
	});
});