import axios from 'axios';

import Gateway from './../../../../api/http/Gateway.js';
import Endpoint from './../../../../api/http/definitions/Endpoint.js';
import Parameter from './../../../../api/http/definitions/Parameter.js';
import Parameters from './../../../../api/http/definitions/Parameters.js';
import ProtocolType from './../../../../api/http/definitions/ProtocolType.js';
import VerbType from './../../../../api/http/definitions/VerbType.js';
import Credentials from './../../../../api/http/definitions/Credentials.js';
import ErrorInterceptor from './../../../../api/http/interceptors/ErrorInterceptor.js';
import RequestInterceptor from './../../../../api/http/interceptors/RequestInterceptor.js';
import ResponseInterceptor from './../../../../api/http/interceptors/ResponseInterceptor.js';

describe('When Gateway is used', () => {
	'use strict';

	let axiosRequestSpy;

	beforeEach(() => {
		axiosRequestSpy = spyOn(axios, 'request').and.callFake(async () => ({ data: { ok: true } }));
	});

	it('should invoke axios with composed request options and return data', async () => {
		const endpoint = new Endpoint(
			'quotes',
			'Quotes',
			VerbType.POST,
			ProtocolType.HTTPS,
			'example.com',
			8443,
			new Parameters([ new Parameter('Symbol', 'symbol', async payload => payload.symbol) ]),
			new Parameters([ new Parameter('Mode', 'mode', async payload => payload.mode) ]),
			new Parameters([ new Parameter('Token', 'x-token', async payload => payload.token) ]),
			new Parameters([ new Parameter('Body', 'body.value', async payload => payload.value) ]),
			new Credentials(payload => payload.user, payload => payload.pass),
			RequestInterceptor.fromDelegate(options => {
				options.requestIntercepted = true;
				return options;
			}),
			ResponseInterceptor.DATA,
			ErrorInterceptor.EMPTY
		);

		const result = await Gateway.invoke(endpoint, {
			symbol: 'A/B',
			mode: 'full',
			token: 'abc',
			value: 123,
			user: 'u',
			pass: 'p'
		});

		expect(result).toEqual({ ok: true });
	});

	it('should invoke axios with correct request options structure', async () => {
		const endpoint = new Endpoint(
			'quotes',
			'Quotes',
			VerbType.POST,
			ProtocolType.HTTPS,
			'example.com',
			8443,
			new Parameters([ new Parameter('Symbol', 'symbol', async payload => payload.symbol) ]),
			new Parameters([ new Parameter('Mode', 'mode', async payload => payload.mode) ]),
			new Parameters([ new Parameter('Token', 'x-token', async payload => payload.token) ]),
			new Parameters([ new Parameter('Body', 'body.value', async payload => payload.value) ]),
			new Credentials(payload => payload.user, payload => payload.pass),
			RequestInterceptor.fromDelegate(options => {
				options.requestIntercepted = true;
				return options;
			}),
			ResponseInterceptor.DATA,
			ErrorInterceptor.EMPTY
		);

		await Gateway.invoke(endpoint, {
			symbol: 'A/B',
			mode: 'full',
			token: 'abc',
			value: 123,
			user: 'u',
			pass: 'p'
		});

		expect(axiosRequestSpy).toHaveBeenCalledWith(jasmine.objectContaining({
			method: 'post',
			url: 'https://example.com:8443/A%2FB',
			headers: { 'x-token': 'abc' },
			params: { mode: 'full' },
			data: { value: 123 },
			auth: { username: 'u', password: 'p' },
			requestIntercepted: true
		}));
	});

	it('should omit the default port from the request URL', async () => {
		const endpoint = new Endpoint('quotes', 'Quotes', VerbType.GET, ProtocolType.HTTPS, 'example.com');

		await Gateway.invoke(endpoint, { });

		expect(axiosRequestSpy).toHaveBeenCalledWith(jasmine.objectContaining({
			method: 'get',
			url: 'https://example.com/'
		}));
	});

	it('should reject missing required parameter values', async () => {
		const endpoint = new Endpoint(
			'quotes',
			'Quotes',
			VerbType.GET,
			ProtocolType.HTTPS,
			'example.com',
			443,
			new Parameters([ new Parameter('Symbol', 'symbol', async () => null) ])
		);

		await expectAsync(Gateway.invoke(endpoint, { })).toBeRejected();
	});

	it('should not call axios when required parameter values are missing', async () => {
		const endpoint = new Endpoint(
			'quotes',
			'Quotes',
			VerbType.GET,
			ProtocolType.HTTPS,
			'example.com',
			443,
			new Parameters([ new Parameter('Symbol', 'symbol', async () => null) ])
		);

		try {
			await Gateway.invoke(endpoint, { });
		} catch (e) {
			// expected
		}

		expect(axiosRequestSpy).not.toHaveBeenCalled();
	});

	it('should allow missing optional parameter values', async () => {
		const endpoint = new Endpoint(
			'quotes',
			'Quotes',
			VerbType.GET,
			ProtocolType.HTTPS,
			'example.com',
			443,
			new Parameters([ new Parameter('Symbol', 'symbol', async () => null, true) ])
		);

		await Gateway.invoke(endpoint, { });

		expect(axiosRequestSpy).toHaveBeenCalledWith(jasmine.objectContaining({
			url: 'https://example.com/'
		}));
	});

	it('should delegate axios errors to the endpoint error interceptor', async () => {
		const remoteError = new Error('remote');
		const endpoint = new Endpoint(
			'quotes',
			'Quotes',
			VerbType.GET,
			ProtocolType.HTTPS,
			'example.com',
			443,
			new Parameters(),
			new Parameters(),
			new Parameters(),
			new Parameters(),
			null,
			RequestInterceptor.EMPTY,
			ResponseInterceptor.EMPTY,
			ErrorInterceptor.fromDelegate(async error => {
				throw { wrapped: error.message };
			})
		);

		axiosRequestSpy.and.callFake(async () => {
			throw remoteError;
		});

		await expectAsync(Gateway.invoke(endpoint, { })).toBeRejectedWith({ wrapped: 'remote' });
	});

	it('should validate endpoint arguments', async () => {
		await expectAsync(Gateway.invoke(null, { })).toBeRejected();
	});
});
