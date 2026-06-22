import Parameter from './../../../../../api/http/definitions/Parameter.js';
import Parameters from './../../../../../api/http/definitions/Parameters.js';

describe('When Parameters are constructed', () => {
	'use strict';

	let parameterA;
	let parameterB;
	let parameters;

	beforeEach(() => {
		parameterA = new Parameter('A', 'a', async () => 'a');
		parameterB = new Parameter('B', 'b', async () => 'b');

		parameters = new Parameters([ parameterA ]);
	});

	it('should expose the parameter list', () => {
		expect(parameters.parameters).toEqual([ parameterA ]);
	});

	it('should validate successfully', () => {
		expect(() => parameters.validate()).not.toThrow();
	});

	it('should have the expected string representation', () => {
		expect(parameters.toString()).toEqual('[Parameters]');
	});

	it('should reject non-Parameter items', () => {
		expect(() => new Parameters([ { } ]).validate()).toThrow();
	});

	describe('and two parameter collections are merged', () => {
		let merged;

		beforeEach(() => {
			merged = Parameters.merge(parameters, new Parameters([
				new Parameter('A duplicate', 'a', async () => 'duplicate'),
				parameterB
			]));
		});

		it('should keep existing parameters first', () => {
			expect(merged.parameters[0]).toBe(parameterA);
		});

		it('should add parameters with new keys', () => {
			expect(merged.parameters[1]).toBe(parameterB);
		});

		it('should not duplicate parameters with existing keys', () => {
			expect(merged.parameters.length).toEqual(2);
		});
	});
});
