const assert = require('./../../../lang/assert');

const CredentialsBuilder = require('./CredentialsBuilder'),
	ParametersBuilder = require('./ParametersBuilder');

const Endpoint = require('./../definitions/Endpoint'),
	Parameters = require('./../definitions/Parameters'),
	ProtocolType = require('./../definitions/ProtocolType'),
	VerbType = require('./../definitions/VerbType');

const CompositeErrorInterceptor = require('./../interceptors/CompositeErrorInterceptor'),
	CompositeResponseInterceptor = require('./../interceptors/CompositeResponseInterceptor'),
	CompositeRequestInterceptor = require('./../interceptors/CompositeRequestInterceptor'),
	ErrorInterceptor = require('./../interceptors/ErrorInterceptor'),
	ResponseInterceptor = require('./../interceptors/ResponseInterceptor'),
	RequestInterceptor = require('./../interceptors/RequestInterceptor');

module.exports = (() => {
	'use strict';

	/**
	 * Fluent interface for building a {@link Endpoint}.
	 *
	 * @public
	 * @param {string} name
	 */
	class EndpointBuilder {
		constructor(name, description) {
			assert.argumentIsRequired(name, 'name', String);
			assert.argumentIsOptional(description, 'description', String);

			this._endpoint = new Endpoint(name, description);
		}

		/**
		 * The {@link Endpoint}, given all the information provided thus far.
		 *
		 * @public
		 * @returns {Endpoint}
		 */
		get endpoint() {
			return this._endpoint;
		}

		/**
		 * Sets the verb.
		 *
		 * @public
		 * @param {VerbType} verb
		 * @returns {EndpointBuilder}
		 */
		withVerb(verb) {
			assert.argumentIsRequired(verb, 'verb', VerbType, 'VerbType');

			this._endpoint = new Endpoint(this.endpoint.name, this.endpoint.description, verb, this.endpoint.protocol, this.endpoint.host, this.endpoint.port, this.endpoint.path, this.endpoint.query, this.endpoint.headers, this.endpoint.body, this.endpoint.credentials, this.endpoint.requestInterceptor, this.endpoint.responseInterceptor, this.endpoint.errorInterceptor);

			return this;
		}

		/**
		 * Sets the host.
		 *
		 * @public
		 * @param {ProtocolType} protocol
		 * @returns {EndpointBuilder}
		 */
		withProtocol(protocol) {
			assert.argumentIsRequired(protocol, 'protocol', ProtocolType, 'ProtocolType');

			this._endpoint = new Endpoint(this.endpoint.name, this.endpoint.description, this.endpoint.verb, protocol, this.endpoint.host, this.endpoint.port, this.endpoint.path, this.endpoint.query, this.endpoint.headers, this.endpoint.body, this.endpoint.credentials, this.endpoint.requestInterceptor, this.endpoint.responseInterceptor, this.endpoint.errorInterceptor);

			return this;
		}

		/**
		 * Sets the host.
		 *
		 * @public
		 * @param {String} host
		 * @returns {EndpointBuilder}
		 */
		withHost(host) {
			assert.argumentIsRequired(host, 'host', String);

			this._endpoint = new Endpoint(this.endpoint.name, this.endpoint.description, this.endpoint.verb, this.endpoint.protocol, host, this.endpoint.port, this.endpoint.path, this.endpoint.query, this.endpoint.headers, this.endpoint.body, this.endpoint.credentials, this.endpoint.requestInterceptor, this.endpoint.responseInterceptor, this.endpoint.errorInterceptor);

			return this;
		}

		/**
		 * Sets the port.
		 *
		 * @public
		 * @param {Number} port
		 * @returns {EndpointBuilder}
		 */
		withPort(port) {
			assert.argumentIsRequired(port, 'port', Number);

			this._endpoint = new Endpoint(this.endpoint.name, this.endpoint.description, this.endpoint.verb, this.endpoint.protocol, this.endpoint.host, port, this.endpoint.path, this.endpoint.query, this.endpoint.headers, this.endpoint.body, this.endpoint.credentials, this.endpoint.requestInterceptor, this.endpoint.responseInterceptor, this.endpoint.errorInterceptor);

			return this;
		}

		/**
		 * Adds a {@link Parameters} collection, describing the request headers, using a callback.
		 *
		 * @public
		 * @param {EndpointBuilder~parametersBuilderCallback} callback
		 * @returns {EndpointBuilder}
		 */
		withHeadersBuilder(callback) {
			assert.argumentIsRequired(callback, 'callback', Function);

			const builder = new ParametersBuilder();

			callback(builder);

			const headers = builder.parameters;

			this._endpoint = new Endpoint(this.endpoint.name, this.endpoint.description, this.endpoint.verb, this.endpoint.protocol, this.endpoint.host, this.endpoint.port, this.endpoint.path, this.endpoint.query, headers, this.endpoint.body, this.endpoint.credentials, this.endpoint.requestInterceptor, this.endpoint.responseInterceptor, this.endpoint.errorInterceptor);

			return this;
		}

		/**
		 * Adds a {@link Parameters} collection, describing the request path, using a callback.
		 *
		 * @public
		 * @param {EndpointBuilder~parametersBuilderCallback} callback
		 * @returns {EndpointBuilder}
		 */
		withPathBuilder(callback) {
			assert.argumentIsRequired(callback, 'callback', Function);

			const builder = new ParametersBuilder(true);

			callback(builder);

			const path = builder.parameters;

			this._endpoint = new Endpoint(this.endpoint.name, this.endpoint.description, this.endpoint.verb, this.endpoint.protocol, this.endpoint.host, this.endpoint.port, path, this.endpoint.query, this.endpoint.headers, this.endpoint.body, this.endpoint.credentials, this.endpoint.requestInterceptor, this.endpoint.responseInterceptor, this.endpoint.errorInterceptor);

			return this;
		}

		/**
		 * Adds a {@link Parameters} collection, describing the request querystring, using a callback.
		 *
		 * @public
		 * @param {EndpointBuilder~parametersBuilderCallback} callback
		 * @returns {EndpointBuilder}
		 */
		withQueryBuilder(callback) {
			assert.argumentIsRequired(callback, 'callback', Function);

			const builder = new ParametersBuilder();

			callback(builder);

			const query = builder.parameters;

			this._endpoint = new Endpoint(this.endpoint.name, this.endpoint.description, this.endpoint.verb, this.endpoint.protocol, this.endpoint.host, this.endpoint.port, this.endpoint.path, query, this.endpoint.headers, this.endpoint.body, this.endpoint.credentials, this.endpoint.requestInterceptor, this.endpoint.responseInterceptor, this.endpoint.errorInterceptor);

			return this;
		}

		/**
		 * Adds a {@link Parameters} collection, describing the request body, using a callback.
		 *
		 * @public
		 * @param {EndpointBuilder~parametersBuilderCallback} callback
		 * @returns {EndpointBuilder}
		 */
		withBodyBuilder(callback) {
			assert.argumentIsRequired(callback, 'callback', Function);

			const builder = new ParametersBuilder();

			callback(builder);

			const body = builder.parameters;

			this._endpoint = new Endpoint(this.endpoint.name, this.endpoint.description, this.endpoint.verb, this.endpoint.protocol, this.endpoint.host, this.endpoint.port, this.endpoint.path, this.endpoint.query, this.endpoint.headers, body, this.endpoint.credentials, this.endpoint.requestInterceptor, this.endpoint.responseInterceptor, this.endpoint.errorInterceptor);

			return this;
		}

		/**
		 * Adds a body to the request.
		 *
		 * @public
		 * @param {String=} description - The human-readable description of the request body.
		 * @returns {EndpointBuilder}
		 */
		withBody(description) {
			assert.argumentIsOptional(description, 'description', String);

			return this.withBodyBuilder((bodyBuilder) => {
				bodyBuilder.withDelegateParameter((description || 'request payload'), 'body', x => x);
			});
		}

		withBasicAuthentication(username, password) {
			assert.argumentIsRequired(username, 'username', String);
			assert.argumentIsRequired(password, 'password', String);

			return this.withBasicAuthenticationBuilder((credentialsBuilder) => {
				credentialsBuilder.withLiteralUsername(username);
				credentialsBuilder.withLiteralPassword(password);
			});
		}

		withBasicAuthenticationBuilder(callback) {
			assert.argumentIsRequired(callback, 'callback', Function);

			const builder = new CredentialsBuilder();

			callback(builder);

			const credentials = builder.credentials;

			this._endpoint = new Endpoint(this.endpoint.name, this.endpoint.description, this.endpoint.verb, this.endpoint.protocol, this.endpoint.host, this.endpoint.port, this.endpoint.path, this.endpoint.query, this.endpoint.headers, this.endpoint.body, credentials, this.endpoint.requestInterceptor, this.endpoint.responseInterceptor, this.endpoint.errorInterceptor);

			return this;
		}

		/**
		 * Adds a {@link RequestInterceptor}.
		 *
		 * @public
		 * @param {RequestInterceptor} requestInterceptor
		 * @returns {EndpointBuilder}
		 */
		withRequestInterceptor(requestInterceptor) {
			assert.argumentIsRequired(requestInterceptor, 'requestInterceptor', RequestInterceptor, 'RequestInterceptor');

			let existingRequestInterceptor = this.endpoint.requestInterceptor;
			let updatedRequestInterceptor;

			if (existingRequestInterceptor && existingRequestInterceptor !== RequestInterceptor.EMPTY) {
				updatedRequestInterceptor = new CompositeRequestInterceptor(existingRequestInterceptor, requestInterceptor);
			} else {
				updatedRequestInterceptor = requestInterceptor;
			}

			this._endpoint = new Endpoint(this.endpoint.name, this.endpoint.description, this.endpoint.verb, this.endpoint.protocol, this.endpoint.host, this.endpoint.port, this.endpoint.path, this.endpoint.query, this.endpoint.headers, this.endpoint.body, this.endpoint.credentials, updatedRequestInterceptor, this.endpoint.responseInterceptor, this.endpoint.errorInterceptor);

			return this;
		}

		/**
		 * Adds a {@link ResponseInterceptor} for successful web service responses.
		 *
		 * @public
		 * @param {ResponseInterceptor} responseInterceptor
		 * @returns {EndpointBuilder}
		 */
		withResponseInterceptor(responseInterceptor) {
			assert.argumentIsRequired(responseInterceptor, 'responseInterceptor', ResponseInterceptor, 'ResponseInterceptor');

			let existingResponseInterceptor = this.endpoint.responseInterceptor;
			let updatedResponseInterceptor;

			if (existingResponseInterceptor && existingResponseInterceptor !== ResponseInterceptor.EMPTY) {
				updatedResponseInterceptor = new CompositeResponseInterceptor(existingResponseInterceptor, responseInterceptor);
			} else {
				updatedResponseInterceptor = responseInterceptor;
			}

			this._endpoint = new Endpoint(this.endpoint.name, this.endpoint.description, this.endpoint.verb, this.endpoint.protocol, this.endpoint.host, this.endpoint.port, this.endpoint.path, this.endpoint.query, this.endpoint.headers, this.endpoint.body, this.endpoint.credentials, this.endpoint.requestInterceptor, updatedResponseInterceptor, this.endpoint.errorInterceptor);

			return this;
		}

		/**
		 * Adds a {@link ErrorInterceptor} for handling remote web service errors.
		 *
		 * @public
		 * @param {ErrorInterceptor} responseInterceptor
		 * @returns {EndpointBuilder}
		 */
		withErrorInterceptor(errorInterceptor) {
			assert.argumentIsRequired(errorInterceptor, 'errorInterceptor', ErrorInterceptor, 'ErrorInterceptor');

			let existingErrorInterceptor = this.endpoint.errorInterceptor;
			let updatedErrorInterceptor;

			if (existingErrorInterceptor && existingErrorInterceptor !== ErrorInterceptor.EMPTY) {
				updatedErrorInterceptor = new CompositeErrorInterceptor(existingErrorInterceptor, errorInterceptor);
			} else {
				updatedErrorInterceptor = errorInterceptor;
			}

			this._endpoint = new Endpoint(this.endpoint.name, this.endpoint.description, this.endpoint.verb, this.endpoint.protocol, this.endpoint.host, this.endpoint.port, this.endpoint.path, this.endpoint.query, this.endpoint.headers, this.endpoint.body, this.endpoint.credentials, this.endpoint.requestInterceptor, this.endpoint.responseInterceptor, updatedErrorInterceptor);

			return this;
		}

		/**
		 * Factory function for creating an {@link EndpointBuilder} instance.
		 *
		 * @static
		 * @public
		 * @param {String} name
		 * @param {String=} description
		 * @returns {EndpointBuilder}
		 */
		static for(name, description) {
			return new EndpointBuilder(name, description);
		}

		toString() {
			return '[EndpointBuilder]';
		}
	}

	/**
	 * A function that returns a {@link ParametersBuilder}.
	 *
	 * @callback EndpointBuilder~parametersBuilderCallback
	 * @param {ParametersBuilder} parameterBuilder
	 */

	return EndpointBuilder;
})();
