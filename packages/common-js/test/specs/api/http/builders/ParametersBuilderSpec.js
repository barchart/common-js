import Parameters from './../../../../../api/http/definitions/Parameters.js';
import ParametersBuilder from './../../../../../api/http/builders/ParametersBuilder.js';

describe('When a ParametersBuilder is used', () => {
	'use strict';

	let builder;

	beforeEach(() => {
		builder = new ParametersBuilder();
	});

	it('should expose a Parameters instance', () => {
		expect(builder.parameters instanceof Parameters).toEqual(true);
	});

	it('should return builder when adding delegate parameter', () => {
		expect(builder.withDelegateParameter('Name', 'name', payload => payload.name, false, value => value.toUpperCase())).toBe(builder);
	});

	it('should set delegate parameter description correctly', () => {
		builder.withDelegateParameter('Name', 'name', payload => payload.name, false, value => value.toUpperCase());

		expect(builder.parameters.parameters[0].description).toEqual('Name');
	});

	it('should set delegate parameter key correctly', () => {
		builder.withDelegateParameter('Name', 'name', payload => payload.name, false, value => value.toUpperCase());

		expect(builder.parameters.parameters[0].key).toEqual('name');
	});

	it('should set delegate parameter optional correctly', () => {
		builder.withDelegateParameter('Name', 'name', payload => payload.name, false, value => value.toUpperCase());

		expect(builder.parameters.parameters[0].optional).toEqual(false);
	});

	it('should apply delegate parameter extractor with formatter', async () => {
		builder.withDelegateParameter('Name', 'name', payload => payload.name, false, value => value.toUpperCase());

		await expectAsync(builder.parameters.parameters[0].extractor({ name: 'luka' })).toBeResolvedTo('LUKA');
	});

	it('should set literal parameter optional correctly', () => {
		builder.withLiteralParameter('Token', 'token', 'abc', true);

		expect(builder.parameters.parameters[0].optional).toEqual(true);
	});

	it('should apply literal parameter extractor', async () => {
		builder.withLiteralParameter('Token', 'token', 'abc', true);

		await expectAsync(builder.parameters.parameters[0].extractor({ })).toBeResolvedTo('abc');
	});

	it('should use the key as the literal parameter value when no value is supplied', async () => {
		builder.withLiteralParameter('Token', 'token');

		await expectAsync(builder.parameters.parameters[0].extractor({ })).toBeResolvedTo('token');
	});

	it('should apply variable parameter extractor with nested path', async () => {
		builder.withVariableParameter('Identifier', 'id', 'nested.id', false, value => `#${value}`);

		await expectAsync(builder.parameters.parameters[0].extractor({ nested: { id: 42 } })).toBeResolvedTo('#42');
	});

	it('should apply variable parameter extractor with missing path', async () => {
		builder.withVariableParameter('Identifier', 'id', 'nested.id', false, value => `#${value}`);

		await expectAsync(builder.parameters.parameters[0].extractor({ })).toBeResolvedTo('#null');
	});

	it('should mark parameters optional when the builder is required', () => {
		const requiredBuilder = new ParametersBuilder(true);

		requiredBuilder.withLiteralParameter('Id', 'id');

		expect(requiredBuilder.parameters.parameters[0].optional).toEqual(true);
	});
});
