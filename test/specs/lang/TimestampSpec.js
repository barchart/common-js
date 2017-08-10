var Timestamp = require('./../../../lang/Timestamp');

describe('When Timestamp is created from a timestamp (1502372574350)', function() {
	'use strict';

	var instance;

	beforeEach(function() {
		instance = new Timestamp(1502372574350);
	});

	it('should not have instantiated the underlying moment', function() {
		expect(instance._moment).toEqual(null);
	});

	it('should know the timestamp', function() {
		expect(instance.timestamp).toEqual(1502372574350);
	});

	describe('and the "moment" property is accessed', function() {
		var m;

		beforeEach(function() {
			m = instance.moment;
		});

		it('should not have instantiated the underlying moment', function() {
			expect(instance._moment).not.toEqual(null);
		});

		it('should return a moment', function() {
			expect(m.isValid()).toEqual(true);
		});

		describe('and the "moment" property is accessed (again)', function() {
			var n;

			beforeEach(function() {
				n = instance.moment;
			});

			it('should return the same moment', function() {
				expect(m).toBe(n);
			});
		});
	});
});