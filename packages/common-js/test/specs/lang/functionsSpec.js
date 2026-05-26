const functions = require('./../../../lang/functions');

describe('when using the tautology function', () => {
	'use strict';

	let tautology;

	beforeEach(() => {
		tautology = functions.getTautology();
	});

	it('if null is passed, null should be returned', () => {
		expect(tautology(null)).toEqual(null);
	});

	it('if undefined is passed, undefined should be returned', () => {
		expect(tautology(undefined)).toEqual(undefined);
	});

	it('if Math.PI is passed, Math.PI should be returned', () => {
		expect(tautology(Math.PI)).toEqual(Math.PI);
	});

	it('if an object is passed, the object should be returned', () => {
		let x;

		expect(tautology(x = { })).toBe(x);
	});
});