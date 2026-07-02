import ErrorInterceptor from './../../../../../api/http/interceptors/ErrorInterceptor.js';

describe('When ErrorInterceptor is used', () => {
	'use strict';

	let endpoint;

	beforeEach(() => {
		endpoint = { description: 'Endpoint' };
	});

	it('should reject errors using the base implementation', async () => {
		await expectAsync(new ErrorInterceptor().process('raw', endpoint)).toBeRejectedWith('raw');
	});

	it('should expose an empty interceptor', async () => {
		await expectAsync(ErrorInterceptor.EMPTY.process('raw', endpoint)).toBeRejectedWith('raw');
	});

	it('should create delegate interceptors that reject with delegated values', async () => {
		const delegate = jasmine.createSpy('delegate').and.callFake(async () => {
			throw 'done';
		});
		const interceptor = ErrorInterceptor.fromDelegate(delegate);

		await expectAsync(interceptor.process('raw', endpoint)).toBeRejectedWith('done');
	});

	it('should create delegate interceptors that call the delegate with correct arguments', async () => {
		const delegate = jasmine.createSpy('delegate').and.callFake(async () => {
			throw 'done';
		});
		const interceptor = ErrorInterceptor.fromDelegate(delegate);

		try {
			await interceptor.process('raw', endpoint);
		} catch (e) {
			// expected
		}

		expect(delegate).toHaveBeenCalledWith('raw', endpoint);
	});

	it('should reject deserialized JSON response data from the general interceptor', async () => {
		await expectAsync(ErrorInterceptor.GENERAL.process({
			response: {
				headers: { 'content-type': 'application/json' },
				data: '{"message":"bad"}'
			}
		}, endpoint)).toBeRejectedWith({ message: 'bad' });
	});

	it('should reject object JSON response data from the general interceptor', async () => {
		await expectAsync(ErrorInterceptor.GENERAL.process({
			response: {
				headers: { 'content-type': 'application/json' },
				data: { message: 'bad' }
			}
		}, endpoint)).toBeRejectedWith({ message: 'bad' });
	});

	it('should convert network errors with no response into authorization failures', async () => {
		await expectAsync(ErrorInterceptor.GENERAL.process({ message: 'Network Error' }, endpoint)).toBeRejected();
	});

	it('should convert general errors into general failures', async () => {
		await expectAsync(ErrorInterceptor.GENERAL.process({ message: 'Other Error' }, endpoint)).toBeRejected();
	});

	it('should validate delegate arguments', () => {
		expect(() => ErrorInterceptor.fromDelegate(null)).toThrow();
	});
});
