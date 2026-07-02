import FailureType from './../../../../api/failures/FailureType.js';

describe('When FailureType values are used', () => {
	'use strict';

	const failureTypes = [
		'REQUEST_CONSTRUCTION_FAILURE',
		'REQUEST_PARAMETER_MISSING',
		'REQUEST_PARAMETER_MALFORMED',
		'REQUEST_IDENTITY_FAILURE',
		'REQUEST_AUTHORIZATION_FAILURE',
		'REQUEST_INPUT_MALFORMED',
		'SCHEMA_VALIDATION_FAILURE',
		'REQUEST_GENERAL_FAILURE',
		'ENTITLEMENTS_FAILED'
	];

	failureTypes.forEach((name) => {
		describe(`for ${name}`, () => {
			it('should be a FailureType instance', () => {
				expect(FailureType[name] instanceof FailureType).toEqual(true);
			});

			it('should have correct code', () => {
				expect(FailureType[name].code).toEqual(name);
			});

			it('should have a string template', () => {
				expect(typeof FailureType[name].template).toEqual('string');
			});
		});
	});

	describe('with custom constructor metadata', () => {
		let type;

		beforeEach(() => {
			type = new FailureType('CUSTOM', 'Template', false, 409, true);
		});

		it('should have the correct template', () => {
			expect(type.template).toEqual('Template');
		});

		it('should have the correct severe value', () => {
			expect(type.severe).toEqual(false);
		});

		it('should have the correct error code', () => {
			expect(type.error).toEqual(409);
		});

		it('should have the correct verbose value', () => {
			expect(type.verbose).toEqual(true);
		});
	});

	describe('with default optional constructor metadata', () => {
		let type;

		beforeEach(() => {
			type = new FailureType('CUSTOM', 'Template');
		});

		it('should default severe to true', () => {
			expect(type.severe).toEqual(true);
		});

		it('should default error to null', () => {
			expect(type.error).toBeNull();
		});

		it('should default verbose to false', () => {
			expect(type.verbose).toEqual(false);
		});
	});

	it('should return HTTP status code 401 for identity failure', () => {
		expect(FailureType.getHttpStatusCode(FailureType.REQUEST_IDENTITY_FAILURE)).toEqual(401);
	});

	it('should return HTTP status code 403 for authorization failure', () => {
		expect(FailureType.getHttpStatusCode(FailureType.REQUEST_AUTHORIZATION_FAILURE)).toEqual(403);
	});

	it('should return a default HTTP status code for other failures', () => {
		expect(FailureType.getHttpStatusCode(FailureType.REQUEST_GENERAL_FAILURE)).toEqual(400);
	});

	it('should validate getHttpStatusCode arguments', () => {
		expect(() => FailureType.getHttpStatusCode(null)).toThrow();
	});
});
