const UppercaseResultProcessor = require('./../../../../data/processors/UppercaseResultProcessor');

describe('When a UppercaseResultProcessor is used on a string-based property', () => {
	'use strict';

	let processor;

	beforeEach(() => {
		processor = new UppercaseResultProcessor({ propertyName: 'volume' });
	});

	describe('and the property does not exist', () => {
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

		it('the object should not have a "volume" property defined', () => {
			expect(result.hasOwnProperty('volume')).toEqual(false);
		});
	});

	describe('and the property value has no lowercase letters', () => {
		let result;
		let original;

		beforeEach((done) => {
			processor.process(original = { volume: 'LOUD' })
				.then((r) => {
					result = r;
					done();
				});
		});

		it('the original object should be returned', () => {
			expect(result).toBe(original);
		});

		it('the "volume" property value should be unchanged', () => {
			expect(result.volume).toEqual('LOUD');
		});
	});

	describe('and the property value has lower letters', () => {
		let result;
		let original;

		beforeEach((done) => {
			processor.process(original = { volume: 'quiet' })
				.then((r) => {
					result = r;
					done();
				});
		});

		it('the original object should be returned', () => {
			expect(result).toBe(original);
		});

		it('the "volume" property value should be changed to lowercase', () => {
			expect(result.volume).toEqual('QUIET');
		});
	});

	describe('and the property value is not a string', () => {
		let result;
		let original;
		let volume;

		beforeEach((done) => {
			processor.process(original = { volume: volume = { decibels: 110 } })
				.then((r) => {
					result = r;
					done();
				});
		});

		it('the original object should be returned', () => {
			expect(result).toBe(original);
		});

		it('the "volume" property value should not be changed', () => {
			expect(result.volume).toBe(volume);
		});
	});
});