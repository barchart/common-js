var AdHoc = require('./../../../lang/AdHoc');

describe('When wrapping an object in an ad hoc serialization container', function() {
	'use strict';

	var data;
	var adHoc;

	beforeEach(function() {
		adHoc = new AdHoc(data = { a: 1, b: 'two' });
	});

	it('should contain the wrapped object', function() {
		expect(adHoc.data).toBe(data);
	});

	describe('and container is serialized', function() {
		var serialized;

		beforeEach(function() {
			serialized = adHoc.toJSON();
		});

		it('should be an escaped string', function() {
			expect(serialized).toEqual('{\"a\":1,\"b\":\"two\"}');
		});

		describe('and container is deserialized', function() {
			var deserialized;

			beforeEach(function() {
				deserialized = AdHoc.parse(serialized);
			});

			it('should be an ad hoc container', function() {
				expect(deserialized instanceof AdHoc).toEqual(true);
			});

			it('should contain a clone of the original data', function() {
				expect(deserialized.data.a).toEqual(data.a);
				expect(deserialized.data.b).toEqual(data.b);
			});
		});
	});
});

