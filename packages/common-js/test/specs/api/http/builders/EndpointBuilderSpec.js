import Endpoint from './../../../../../api/http/definitions/Endpoint.js';
import ProtocolType from './../../../../../api/http/definitions/ProtocolType.js';
import VerbType from './../../../../../api/http/definitions/VerbType.js';
import EndpointBuilder from './../../../../../api/http/builders/EndpointBuilder.js';
import ErrorInterceptor from './../../../../../api/http/interceptors/ErrorInterceptor.js';
import RequestInterceptor from './../../../../../api/http/interceptors/RequestInterceptor.js';
import ResponseInterceptor from './../../../../../api/http/interceptors/ResponseInterceptor.js';

describe('When an EndpointBuilder is used', () => {
	'use strict';

	let builder;

	beforeEach(() => {
		builder = new EndpointBuilder('quotes', 'Quotes endpoint');
	});

	it('should expose an Endpoint instance', () => {
		expect(builder.endpoint instanceof Endpoint).toEqual(true);
	});

	it('should have correct endpoint name', () => {
		expect(builder.endpoint.name).toEqual('quotes');
	});

	it('should have correct endpoint description', () => {
		expect(builder.endpoint.description).toEqual('Quotes endpoint');
	});

	it('should return builder when setting verb', () => {
		expect(builder.withVerb(VerbType.POST)).toBe(builder);
	});

	it('should return builder when setting protocol', () => {
		expect(builder.withProtocol(ProtocolType.HTTP)).toBe(builder);
	});

	it('should return builder when setting host', () => {
		expect(builder.withHost('example.com')).toBe(builder);
	});

	it('should return builder when setting port', () => {
		expect(builder.withPort(8080)).toBe(builder);
	});

	it('should set verb correctly', () => {
		builder.withVerb(VerbType.POST);

		expect(builder.endpoint.verb).toBe(VerbType.POST);
	});

	it('should set protocol correctly', () => {
		builder.withProtocol(ProtocolType.HTTP);

		expect(builder.endpoint.protocol).toBe(ProtocolType.HTTP);
	});

	it('should set host correctly', () => {
		builder.withHost('example.com');

		expect(builder.endpoint.host).toEqual('example.com');
	});

	it('should set port correctly', () => {
		builder.withPort(8080);

		expect(builder.endpoint.port).toEqual(8080);
	});

	it('should build path parameters', () => {
		builder.withPathBuilder(path => path.withVariableParameter('Symbol', 'symbol', 'symbol'));
		expect(builder.endpoint.path.parameters.length).toEqual(1);
	});

	it('should build query parameters', () => {
		builder.withQueryBuilder(query => query.withLiteralParameter('Mode', 'mode', 'full'));

		expect(builder.endpoint.query.parameters.length).toEqual(1);
	});

	it('should build header parameters', () => {
		builder.withHeadersBuilder(headers => headers.withLiteralParameter('Token', 'token', 'abc'));

		expect(builder.endpoint.headers.parameters.length).toEqual(1);
	});

	it('should build body parameters', () => {
		builder.withBodyBuilder(body => body.withLiteralParameter('Payload', 'payload', 'value'));

		expect(builder.endpoint.body.parameters.length).toEqual(1);
	});

	it('should build a body parameter with correct description', () => {
		builder.withBody('Payload');

		expect(builder.endpoint.body.parameters[0].description).toEqual('Payload');
	});

	it('should build a body parameter with correct key', () => {
		builder.withBody('Payload');

		expect(builder.endpoint.body.parameters[0].key).toEqual('body');
	});

	it('should build basic authentication username extractor', () => {
		builder.withBasicAuthentication('user', 'pass');

		expect(builder.endpoint.credentials.usernameExtractor({ })).toEqual('user');
	});

	it('should build basic authentication password extractor', () => {
		builder.withBasicAuthentication('user', 'pass');

		expect(builder.endpoint.credentials.passwordExtractor({ })).toEqual('pass');
	});

	it('should build basic authentication with callback for username', () => {
		builder.withBasicAuthenticationBuilder(credentials => {
			credentials.withDelegateUsername(payload => payload.user);
			credentials.withDelegatePassword(payload => payload.pass);
		});

		expect(builder.endpoint.credentials.usernameExtractor({ user: 'u' })).toEqual('u');
	});

	it('should build basic authentication with callback for password', () => {
		builder.withBasicAuthenticationBuilder(credentials => {
			credentials.withDelegateUsername(payload => payload.user);
			credentials.withDelegatePassword(payload => payload.pass);
		});

		expect(builder.endpoint.credentials.passwordExtractor({ pass: 'p' })).toEqual('p');
	});

	it('should compose request interceptors', async () => {
		builder
			.withRequestInterceptor(RequestInterceptor.fromDelegate(request => {
				request.a = true;
				return request;
			}))
			.withRequestInterceptor(RequestInterceptor.fromDelegate(request => {
				request.b = true;
				return request;
			}));

		await expectAsync(builder.endpoint.requestInterceptor.process({ }, builder.endpoint)).toBeResolvedTo({ a: true, b: true });
	});

	it('should compose response interceptors', async () => {
		builder
			.withResponseInterceptor(ResponseInterceptor.fromDelegate(response => {
				response.a = true;
				return response;
			}))
			.withResponseInterceptor(ResponseInterceptor.fromDelegate(response => {
				response.b = true;
				return response;
			}));

		await expectAsync(builder.endpoint.responseInterceptor.process({ }, builder.endpoint)).toBeResolvedTo({ a: true, b: true });
	});

	it('should compose error interceptors', async () => {
		builder
			.withErrorInterceptor(ErrorInterceptor.fromDelegate(error => {
				throw { a: error };
			}))
			.withErrorInterceptor(ErrorInterceptor.fromDelegate(error => {
				throw { b: error };
			}));

		await expectAsync(builder.endpoint.errorInterceptor.process('x', builder.endpoint)).toBeRejectedWith({ b: { a: 'x' } });
	});

	it('should call interceptors in order', async () => {
		const calls = [ ];

		builder
			.withRequestInterceptor(RequestInterceptor.fromDelegate(request => {
				calls.push('request:a');
				return request;
			}))
			.withRequestInterceptor(RequestInterceptor.fromDelegate(request => {
				calls.push('request:b');
				return request;
			}))
			.withResponseInterceptor(ResponseInterceptor.fromDelegate(response => {
				calls.push('response:a');
				return response;
			}))
			.withResponseInterceptor(ResponseInterceptor.fromDelegate(response => {
				calls.push('response:b');
				return response;
			}))
			.withErrorInterceptor(ErrorInterceptor.fromDelegate(error => {
				calls.push('error:a');
				throw error;
			}))
			.withErrorInterceptor(ErrorInterceptor.fromDelegate(error => {
				calls.push('error:b');
				throw error;
			}));

		await builder.endpoint.requestInterceptor.process({ }, builder.endpoint);
		await builder.endpoint.responseInterceptor.process({ }, builder.endpoint);

		try {
			await builder.endpoint.errorInterceptor.process('x', builder.endpoint);
		} catch (e) {
			// expected
		}

		expect(calls).toEqual([ 'request:a', 'request:b', 'response:a', 'response:b', 'error:a', 'error:b' ]);
	});

	it('should create a builder from the static factory', () => {
		expect(EndpointBuilder.for('name') instanceof EndpointBuilder).toEqual(true);
	});

	it('should have the expected string representation', () => {
		expect(builder.toString()).toEqual('[EndpointBuilder]');
	});
});
