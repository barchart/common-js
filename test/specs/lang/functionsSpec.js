var functions = require('./../../../lang/functions');

describe('when using the tautology function', function() {
	'use strict';

	var tautology;

	beforeEach(function() {
		tautology = functions.getTautology();
	});

	it('if null is passed, null should be returned', function() {
		expect(tautology(null)).toEqual(null);
	});

	it('if undefined is passed, undefined should be returned', function() {
		expect(tautology(undefined)).toEqual(undefined);
	});

	it('if Math.PI is passed, Math.PI should be returned', function() {
		expect(tautology(Math.PI)).toEqual(Math.PI);
	});

	it('if an object is passed, the object should be returned', function() {
		var x;

		expect(tautology(x = { })).toBe(x);
	});
});