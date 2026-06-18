import RequestInterceptor from './../../../../../api/http/interceptors/RequestInterceptor.js';

describe('When RequestInterceptor is used', () => {
	'use strict';

	it('should process requests using the base implementation', async () => {
		const request = { };

		await expectAsync(new RequestInterceptor().process(request, null)).toBeResolvedTo(request);
	});

	it('should expose an empty interceptor', async () => {
		const request = { };

		await expectAsync(RequestInterceptor.EMPTY.process(request, null)).toBeResolvedTo(request);
	});

	it('should create delegate interceptors', async () => {
		const endpoint = { name: 'endpoint' };
		const delegate = jasmine.createSpy('delegate').and.returnValue({ ok: true });
		const interceptor = RequestInterceptor.fromDelegate(delegate);

		const result = await interceptor.process({ }, endpoint);

		expect({
			result,
			calls: delegate.calls.allArgs()
		}).toEqual({
			result: { ok: true },
			calls: [ [ { }, endpoint ] ]
		});
	});

	it('should create a plain text response interceptor', async () => {
		const request = await RequestInterceptor.PLAIN_TEXT_RESPONSE.process({ }, null);

		expect(request.transformResponse('text')).toEqual('text');
	});

	it('should validate delegate arguments', () => {
		expect(() => RequestInterceptor.fromDelegate(null)).toThrow();
	});

	it('should have the expected string representation', () => {
		expect(new RequestInterceptor().toString()).toEqual('[RequestInterceptor]');
	});
});
