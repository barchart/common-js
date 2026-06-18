import * as assert from './../../../lang/assert.js';

import Credentials from './../definitions/Credentials.js';

/**
 * Fluent interface for building a {@link Credentials} object.
 *
 * @public
 */
export default class CredentialsBuilder {
	#credentials;

	constructor() {
		this.#credentials = new Credentials();
	}

	/**
	 * The {@link Credentials} object, given all the information provided thus far.
	 *
	 * @public
	 * @returns {Credentials}
	 */
	get credentials() {
		return this.#credentials;
	}

	/**
	 * Sets a literal username.
	 *
	 * @public
	 * @param {string} username
	 * @returns {CredentialsBuilder}
	 */
	withLiteralUsername(username) {
		assert.argumentIsOptional(username, 'username', String);

		return this.withDelegateUsername((ignored) => username);
	}

	/**
	 * Sets a function which returns a username.
	 *
	 * @public
	 * @param {Function} delegate
	 * @returns {CredentialsBuilder}
	 */
	withDelegateUsername(delegate) {
		this.#credentials = new Credentials(delegate, this.#credentials.passwordExtractor);

		return this;
	}

	/**
	 * Sets a literal password.
	 *
	 * @public
	 * @param {string} password
	 * @returns {CredentialsBuilder}
	 */
	withLiteralPassword(password) {
		assert.argumentIsOptional(password, 'password', String);

		return this.withDelegatePassword((ignored) => password);
	}

	/**
	 * Sets a function which returns a password.
	 *
	 * @public
	 * @param {Function} delegate
	 * @returns {CredentialsBuilder}
	 */
	withDelegatePassword(delegate) {
		this.#credentials = new Credentials(this.#credentials.usernameExtractor, delegate);

		return this;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[CredentialsBuilder]';
	}
}
