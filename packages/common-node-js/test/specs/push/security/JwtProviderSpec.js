import Configuration from './../../../../push/security/Configuration.js';
import JwtProvider from './../../../../push/security/JwtProvider.js';

describe('When JWT providers are used with local token generators', () => {
	'use strict';

	it('should expose public push security host configuration', () => {
		expect({
			staging: Configuration.stagingHost,
			production: Configuration.productionHost,
			impersonation: Configuration.getJwtImpersonationHost
		}).toEqual({
			staging: 'push-notifications-stage.aws.barchart.com',
			production: 'push-notifications.aws.barchart.com',
			impersonation: 'jwt-public-stage.aws.barchart.com'
		});
	});

	it('should cache tokens when a refresh interval is configured', async () => {
		let counter = 0;
		const provider = JwtProvider.fromTokenGenerator(() => Promise.resolve(`token-${++counter}`), 0);

		const first = await provider.getToken();
		const second = await provider.getToken();

		expect({
			first,
			second,
			counter
		}).toEqual({
			first: 'token-1',
			second: 'token-1',
			counter: 1
		});

		provider.dispose();
	});

	it('should generate a new token when caching is disabled', async () => {
		let counter = 0;
		const provider = JwtProvider.fromTokenGenerator(() => Promise.resolve(`token-${++counter}`));

		const first = await provider.getToken();
		const second = await provider.getToken();

		expect({
			first,
			second,
			counter
		}).toEqual({
			first: 'token-1',
			second: 'token-2',
			counter: 2
		});

		provider.dispose();
	});
});
