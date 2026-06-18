import Credentials from './../../../../../api/http/definitions/Credentials.js';
import Endpoint from './../../../../../api/http/definitions/Endpoint.js';
import Parameter from './../../../../../api/http/definitions/Parameter.js';
import Parameters from './../../../../../api/http/definitions/Parameters.js';
import ProtocolType from './../../../../../api/http/definitions/ProtocolType.js';
import VerbType from './../../../../../api/http/definitions/VerbType.js';
import ErrorInterceptor from './../../../../../api/http/interceptors/ErrorInterceptor.js';
import RequestInterceptor from './../../../../../api/http/interceptors/RequestInterceptor.js';
import ResponseInterceptor from './../../../../../api/http/interceptors/ResponseInterceptor.js';

describe('When an Endpoint is constructed', () => {
	'use strict';

	let path;
	let query;
	let headers;
	let body;
	let credentials;
	let requestInterceptor;
	let responseInterceptor;
	let errorInterceptor;
	let endpoint;

	beforeEach(() => {
		path = new Parameters([ new Parameter('Id', 'id', () => Promise.resolve('1')) ]);
		query = new Parameters();
		headers = new Parameters();
		body = new Parameters();
		credentials = new Credentials(() => 'user', () => 'pass');
		requestInterceptor = RequestInterceptor.fromDelegate(request => request);
		responseInterceptor = ResponseInterceptor.fromDelegate(response => response);
		errorInterceptor = ErrorInterceptor.fromDelegate(error => Promise.reject(error));

		endpoint = new Endpoint('name', 'Description', VerbType.POST, ProtocolType.HTTP, 'example.com', 8080, path, query, headers, body, credentials, requestInterceptor, responseInterceptor, errorInterceptor);
	});

	it('should expose name through getter', () => {
		expect(endpoint.name).toEqual('name');
	});

	it('should expose description through getter', () => {
		expect(endpoint.description).toEqual('Description');
	});

	it('should expose verb through getter', () => {
		expect(endpoint.verb).toBe(VerbType.POST);
	});

	it('should expose protocol through getter', () => {
		expect(endpoint.protocol).toBe(ProtocolType.HTTP);
	});

	it('should expose host through getter', () => {
		expect(endpoint.host).toEqual('example.com');
	});

	it('should expose port through getter', () => {
		expect(endpoint.port).toEqual(8080);
	});

	it('should expose path through getter', () => {
		expect(endpoint.path).toBe(path);
	});

	it('should expose query through getter', () => {
		expect(endpoint.query).toBe(query);
	});

	it('should expose headers through getter', () => {
		expect(endpoint.headers).toBe(headers);
	});

	it('should expose body through getter', () => {
		expect(endpoint.body).toBe(body);
	});

	it('should expose credentials through getter', () => {
		expect(endpoint.credentials).toBe(credentials);
	});

	it('should expose requestInterceptor through getter', () => {
		expect(endpoint.requestInterceptor).toBe(requestInterceptor);
	});

	it('should expose responseInterceptor through getter', () => {
		expect(endpoint.responseInterceptor).toBe(responseInterceptor);
	});

	it('should expose errorInterceptor through getter', () => {
		expect(endpoint.errorInterceptor).toBe(errorInterceptor);
	});

	describe('with default values', () => {
		let defaulted;

		beforeEach(() => {
			defaulted = new Endpoint('name', 'Description');
		});

		it('should default verb to GET', () => {
			expect(defaulted.verb).toBe(VerbType.GET);
		});

		it('should default protocol to HTTPS', () => {
			expect(defaulted.protocol).toBe(ProtocolType.HTTPS);
		});

		it('should default port to 443', () => {
			expect(defaulted.port).toEqual(443);
		});

		it('should default path to Parameters instance', () => {
			expect(defaulted.path instanceof Parameters).toEqual(true);
		});

		it('should default requestInterceptor to EMPTY', () => {
			expect(defaulted.requestInterceptor).toBe(RequestInterceptor.EMPTY);
		});

		it('should default responseInterceptor to EMPTY', () => {
			expect(defaulted.responseInterceptor).toBe(ResponseInterceptor.EMPTY);
		});

		it('should default errorInterceptor to EMPTY', () => {
			expect(defaulted.errorInterceptor).toBe(ErrorInterceptor.EMPTY);
		});
	});

	it('should validate successfully', () => {
		expect(() => endpoint.validate()).not.toThrow();
	});

	it('should reject empty host value', () => {
		expect(() => new Endpoint('name', null, VerbType.GET, ProtocolType.HTTP, '', 80).validate()).toThrow();
	});

	it('should reject invalid port value', () => {
		expect(() => new Endpoint('name', null, VerbType.GET, ProtocolType.HTTP, 'example.com', 70000).validate()).toThrow();
	});

	it('should reject invalid parameter collections', () => {
		expect(() => new Endpoint('name', null, VerbType.GET, ProtocolType.HTTP, 'example.com', 80, { }).validate()).toThrow();
	});

	it('should reject invalid credentials', () => {
		expect(() => new Endpoint('name', null, VerbType.GET, ProtocolType.HTTP, 'example.com', 80, path, query, headers, body, { }).validate()).toThrow();
	});

	it('should reject invalid requestInterceptor', () => {
		expect(() => new Endpoint('name', null, VerbType.GET, ProtocolType.HTTP, 'example.com', 80, path, query, headers, body, null, { }).validate()).toThrow();
	});

	it('should reject invalid responseInterceptor', () => {
		expect(() => new Endpoint('name', null, VerbType.GET, ProtocolType.HTTP, 'example.com', 80, path, query, headers, body, null, null, { }).validate()).toThrow();
	});

	it('should reject invalid errorInterceptor', () => {
		expect(() => new Endpoint('name', null, VerbType.GET, ProtocolType.HTTP, 'example.com', 80, path, query, headers, body, null, null, null, { }).validate()).toThrow();
	});

	it('should have the expected string representation', () => {
		expect(endpoint.toString()).toEqual('[Endpoint (name=name)]');
	});
});
