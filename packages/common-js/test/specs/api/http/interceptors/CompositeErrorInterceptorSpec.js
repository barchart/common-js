import CompositeErrorInterceptor from './../../../../../api/http/interceptors/CompositeErrorInterceptor.js';
import ErrorInterceptor from './../../../../../api/http/interceptors/ErrorInterceptor.js';

describe('When a CompositeErrorInterceptor is used', () => {
	'use strict';

	it('should process rejected errors through both interceptors in order', async () => {
		const interceptor = new CompositeErrorInterceptor(
			ErrorInterceptor.fromDelegate(async error => {
				throw { first: error };
			}),
			ErrorInterceptor.fromDelegate(async error => {
				throw { second: error };
			})
		);

		await expectAsync(interceptor.process('raw', null)).toBeRejectedWith({ second: { first: 'raw' } });
	});

	it('should validate constructor arguments', () => {
		expect([ () => new CompositeErrorInterceptor(null, ErrorInterceptor.EMPTY), () => new CompositeErrorInterceptor(ErrorInterceptor.EMPTY, null) ].map(throws)).toEqual([ true, true ]);
	});

	it('should have the expected string representation', () => {
		expect(new CompositeErrorInterceptor(ErrorInterceptor.EMPTY, ErrorInterceptor.EMPTY).toString()).toEqual('[CompositeErrorInterceptor]');
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
