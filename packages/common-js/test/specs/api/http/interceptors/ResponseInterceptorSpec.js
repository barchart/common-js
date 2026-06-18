import ResponseInterceptor from './../../../../../api/http/interceptors/ResponseInterceptor.js';

describe('When ResponseInterceptor is used', () => {
	'use strict';

	it('should process responses using the base implementation', async () => {
		const response = { data: 'raw' };

		await expectAsync(new ResponseInterceptor().process(response, null)).toBeResolvedTo(response);
	});

	it('should expose an empty interceptor', async () => {
		const response = { data: 'raw' };

		await expectAsync(ResponseInterceptor.EMPTY.process(response, null)).toBeResolvedTo(response);
	});

	it('should expose a data interceptor', async () => {
		await expectAsync(ResponseInterceptor.DATA.process({ data: 'payload' }, null)).toBeResolvedTo('payload');
	});

	it('should create delegate interceptors', async () => {
		const endpoint = { name: 'endpoint' };
		const delegate = jasmine.createSpy('delegate').and.returnValue('done');
		const interceptor = ResponseInterceptor.fromDelegate(delegate);

		const result = await interceptor.process({ data: 'raw' }, endpoint);

		expect({
			result,
			calls: delegate.calls.allArgs()
		}).toEqual({
			result: 'done',
			calls: [ [ { data: 'raw' }, endpoint ] ]
		});
	});

	it('should validate delegate arguments', () => {
		expect(() => ResponseInterceptor.fromDelegate(null)).toThrow();
	});

	it('should have the expected string representation', () => {
		expect(new ResponseInterceptor().toString()).toEqual('[ResponseInterceptor]');
	});
});
