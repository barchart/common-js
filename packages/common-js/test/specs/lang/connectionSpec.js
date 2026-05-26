const connection = require('./../../../lang/connection');

describe('When "getIsSecure is invoked', () => {
	'use strict';

	it('should return true, if passed true', () => {
		expect(connection.getIsSecure(true)).toEqual(true);
	});

	it('should return false, if passed false', () => {
		expect(connection.getIsSecure(false)).toEqual(false);
	});

	it('should return false, if passed undefined', () => {
		expect(connection.getIsSecure(undefined)).toEqual(false);
	});

	it('should return false, if passed null', () => {
		expect(connection.getIsSecure(undefined)).toEqual(false);
	});
});