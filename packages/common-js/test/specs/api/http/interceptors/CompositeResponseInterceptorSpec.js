import CompositeResponseInterceptor from './../../../../../api/http/interceptors/CompositeResponseInterceptor.js';
import ResponseInterceptor from './../../../../../api/http/interceptors/ResponseInterceptor.js';

describe('When a CompositeResponseInterceptor is used', () => {
	'use strict';

	it('should process responses through both interceptors in order', async () => {
		const interceptor = new CompositeResponseInterceptor(
			ResponseInterceptor.fromDelegate(response => {
				response.first = true;

				return response;
			}),

			ResponseInterceptor.fromDelegate(response => {
				response.second = response.first;

				return response;
			})
		);

		await expectAsync(interceptor.process({ }, null)).toBeResolvedTo({ first: true, second: true });
	});

	it('should validate constructor arguments', () => {
		expect([ () => new CompositeResponseInterceptor(null, ResponseInterceptor.EMPTY), () => new CompositeResponseInterceptor(ResponseInterceptor.EMPTY, null) ].map(throws)).toEqual([ true, true ]);
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
