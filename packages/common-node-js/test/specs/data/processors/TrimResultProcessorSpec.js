const TrimResultProcessor = require('./../../../../data/processors/TrimResultProcessor');

describe('When a TrimResultProcessor is used on a string-based property', () => {
	'use strict';

	let processor;

	beforeEach(() => {
		processor = new TrimResultProcessor({ propertyName: 'hair' });
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

		it('the object should not have a "hair" property defined', () => {
			expect(result.hasOwnProperty('hair')).toEqual(false);
		});
	});

	describe('and the property value has no leading or trailing spaces', () => {
		let result;
		let original;

		beforeEach((done) => {
			processor.process(original = { hair: 'yes' })
				.then((r) => {
					result = r;
					done();
				});
		});

		it('the original object should be returned', () => {
			expect(result).toBe(original);
		});

		it('the "hair" property value should be unchanged', () => {
			expect(result.hair).toEqual('yes');
		});
	});

	describe('and the property value has leading and trailing spaces', () => {
		let result;
		let original;

		beforeEach((done) => {
			processor.process(original = { hair: ' club for men ' })
				.then((r) => {
					result = r;
					done();
				});
		});

		it('the original object should be returned', () => {
			expect(result).toBe(original);
		});

		it('the "hair" property value should be trimmed', () => {
			expect(result.hair).toEqual('club for men');
		});
	});

	describe('and the property value is a single space', () => {
		let result;
		let original;

		beforeEach((done) => {
			processor.process(original = { hair: ' ' })
				.then((r) => {
					result = r;
					done();
				});
		});

		it('the original object should be returned', () => {
			expect(result).toBe(original);
		});

		it('the "hair" property value should be a zero-length string', () => {
			expect(result.hair).toEqual('');
		});
	});
});