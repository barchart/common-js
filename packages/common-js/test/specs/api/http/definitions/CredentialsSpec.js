import Credentials from './../../../../../api/http/definitions/Credentials.js';

describe('When Credentials are constructed', () => {
	'use strict';

	let usernameExtractor;
	let passwordExtractor;
	let credentials;

	beforeEach(() => {
		usernameExtractor = () => 'user';
		passwordExtractor = () => 'pass';

		credentials = new Credentials(usernameExtractor, passwordExtractor);
	});

	it('should expose the username extractor', () => {
		expect(credentials.usernameExtractor).toBe(usernameExtractor);
	});

	it('should expose the password extractor', () => {
		expect(credentials.passwordExtractor).toBe(passwordExtractor);
	});

	it('should validate successfully', () => {
		expect(() => credentials.validate()).not.toThrow();
	});

	it('should have the expected string representation', () => {
		expect(credentials.toString()).toEqual('[Credentials]');
	});

	it('should reject a missing username extractor', () => {
		expect(() => new Credentials(null, passwordExtractor).validate()).toThrow();
	});

	it('should reject a missing password extractor', () => {
		expect(() => new Credentials(usernameExtractor, null).validate()).toThrow();
	});
});
