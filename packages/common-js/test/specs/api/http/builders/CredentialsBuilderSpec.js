import Credentials from './../../../../../api/http/definitions/Credentials.js';
import CredentialsBuilder from './../../../../../api/http/builders/CredentialsBuilder.js';

describe('When a CredentialsBuilder is used', () => {
	'use strict';

	let builder;

	beforeEach(() => {
		builder = new CredentialsBuilder();
	});

	it('should expose a Credentials instance', () => {
		expect(builder.credentials instanceof Credentials).toEqual(true);
	});

	it('should set literal credentials', async () => {
		const usernameBuilder = builder.withLiteralUsername('user');
		const passwordBuilder = builder.withLiteralPassword('pass');

		expect({
			usernameBuilder,
			passwordBuilder,
			username: builder.credentials.usernameExtractor({ }),
			password: builder.credentials.passwordExtractor({ })
		}).toEqual({
			usernameBuilder: builder,
			passwordBuilder: builder,
			username: 'user',
			password: 'pass'
		});
	});

	it('should set delegate credentials', () => {
		const payload = { user: 'luka', pass: 'secret' };

		builder
			.withDelegateUsername(p => p.user)
			.withDelegatePassword(p => p.pass);

		expect({
			username: builder.credentials.usernameExtractor(payload),
			password: builder.credentials.passwordExtractor(payload)
		}).toEqual({
			username: 'luka',
			password: 'secret'
		});
	});

	it('should have the expected string representation', () => {
		expect(builder.toString()).toEqual('[CredentialsBuilder]');
	});
});
