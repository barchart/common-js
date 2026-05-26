const AdHoc = require('./../../../lang/AdHoc');

describe('When wrapping an object in an ad hoc serialization container', () => {
	'use strict';

	let data;
	let adHoc;

	beforeEach(() => {
		adHoc = new AdHoc(data = { a: 1, b: 'two' });
	});

	it('should contain the wrapped object', () => {
		expect(adHoc.data).toBe(data);
	});

	describe('and container is serialized', () => {
		let serialized;

		beforeEach(() => {
			serialized = adHoc.toJSON();
		});

		it('should be an escaped string', () => {
			expect(serialized).toEqual('{\"a\":1,\"b\":\"two\"}');
		});

		describe('and container is deserialized', () => {
			let deserialized;

			beforeEach(() => {
				deserialized = AdHoc.parse(serialized);
			});

			it('should be an ad hoc container', () => {
				expect(deserialized instanceof AdHoc).toEqual(true);
			});

			it('should contain a clone of the original data', () => {
				expect(deserialized.data.a).toEqual(data.a);
				expect(deserialized.data.b).toEqual(data.b);
			});
		});
	});
});

