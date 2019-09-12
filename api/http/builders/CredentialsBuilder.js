const assert = require('./../../../lang/assert');

const Credentials = require('./../definitions/Credentials');

module.exports = (() => {
	'use strict';

	/**
	 * Fluent interface for building a {@link Credentials} object.
	 *
	 * @public
	 */
	class CredentialsBuilder {
		constructor() {
			this._credentials = new Credentials();
		}

		/**
		 * The {@link Credentials} object, given all the information provided thus far.
		 *
		 * @public
		 * @returns {Credentials}
		 */
		get credentials() {
			return this._credentials;
		}

		/**
		 * Sets a literal username.
		 * 
		 * @public
		 * @param {String} username
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
			this._credentials = new Credentials(delegate, this._credentials.passwordExtractor);
			
			return this;
		}

		/**
		 * Sets a literal password.
		 *
		 * @public
		 * @param {String} password
		 * @returns {CredentialsBuilder}
		 */
		withLiteralPassword(password) {
			assert.argumentIsOptional(password, 'password', String);

			return this.withPasswordExtractor((ignored) => password);
		}

		/**
		 * Sets a function which returns a password.
		 *
		 * @public
		 * @param {Function} delegate
		 * @returns {CredentialsBuilder}
		 */
		withDelegatePassword(delegate) {
			this._credentials = new Credentials(this._credentials.usernameExtractor, delegate);

			return this;
		}

		toString() {
			return '[CredentialsBuilder]';
		}
	}

	return CredentialsBuilder;
})();