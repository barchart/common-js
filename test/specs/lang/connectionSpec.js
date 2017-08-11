var connection = require('./../../../lang/connection');

describe('When "getIsSecure is invoked', function() {
	'use strict';

	it('should return true, if passed true', function() {
		expect(connection.getIsSecure(true)).toEqual(true);
	});

	it('should return false, if passed false', function() {
		expect(connection.getIsSecure(false)).toEqual(false);
	});

	it('should return false, if passed undefined', function() {
		expect(connection.getIsSecure(undefined)).toEqual(false);
	});

	it('should return false, if passed null', function() {
		expect(connection.getIsSecure(undefined)).toEqual(false);
	});
});