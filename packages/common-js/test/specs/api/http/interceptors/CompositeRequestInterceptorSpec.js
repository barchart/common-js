import CompositeRequestInterceptor from './../../../../../api/http/interceptors/CompositeRequestInterceptor.js';
import RequestInterceptor from './../../../../../api/http/interceptors/RequestInterceptor.js';

describe('When a CompositeRequestInterceptor is used', () => {
	'use strict';

	it('should process requests through both interceptors in order', async () => {
		const interceptor = new CompositeRequestInterceptor(
			RequestInterceptor.fromDelegate(request => {
				request.first = true;

				return request;
			}),

			RequestInterceptor.fromDelegate(request => {
				request.second = request.first;

				return request;
			})
		);

		await expectAsync(interceptor.process({ }, null)).toBeResolvedTo({ first: true, second: true });
	});

	it('should validate constructor arguments', () => {
		expect([ () => new CompositeRequestInterceptor(null, RequestInterceptor.EMPTY), () => new CompositeRequestInterceptor(RequestInterceptor.EMPTY, null) ].map(throws)).toEqual([ true, true ]);
	});

	it('should have the expected string representation', () => {
		expect(new CompositeRequestInterceptor(RequestInterceptor.EMPTY, RequestInterceptor.EMPTY).toString()).toEqual('[CompositeRequestInterceptor]');
	});
});

function throws(action) {
	try {
		action();

		return false;
	} catch {
		return true;
	}
}
