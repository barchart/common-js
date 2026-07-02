import Parameter from './../../../../../api/http/definitions/Parameter.js';

describe('When a Parameter is constructed', () => {
	'use strict';

	let extractor;
	let parameter;

	beforeEach(() => {
		extractor = async () => 'value';

		parameter = new Parameter('Description', 'name', extractor, true);
	});

	it('should expose the description', () => {
		expect(parameter.description).toEqual('Description');
	});

	it('should expose the key', () => {
		expect(parameter.key).toEqual('name');
	});

	it('should expose the extractor', () => {
		expect(parameter.extractor).toBe(extractor);
	});

	it('should expose the optional flag', () => {
		expect(parameter.optional).toEqual(true);
	});

	it('should validate successfully', () => {
		expect(() => parameter.validate()).not.toThrow();
	});

	it('should reject an empty key', () => {
		expect(() => new Parameter('Description', '', extractor).validate()).toThrow();
	});

	it('should reject a missing extractor', () => {
		expect(() => new Parameter('Description', 'name', null).validate()).toThrow();
	});
});
