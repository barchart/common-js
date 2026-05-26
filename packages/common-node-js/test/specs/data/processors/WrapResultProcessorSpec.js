const WrapResultProcessor = require('./../../../../data/processors/WrapResultProcessor');

describe('When a WrapResultProcessor is created', () => {
	'use strict';

	let processor;
	let configuration;

	beforeEach(() => {
		processor = new WrapResultProcessor(configuration = { propertyName: 'test' });
	});

	describe('and an object is wrapped', () => {
		let input;
		let result;

		beforeEach((done) => {
			processor.process(input = { wrap: 'me' })
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the result should be an object', () => {
			expect(result instanceof Object).toEqual(true);
		});

		it('the result should not be the input object', () => {
			expect(result).not.toBe(input);
		});

		it('the result should have a property name (as specified in configuration)', () => {
			expect(result.hasOwnProperty(configuration.propertyName)).toBe(true);
		});

		it('the result should wrap the input', () => {
			expect(result[configuration.propertyName]).toBe(input);
		});
	});
});