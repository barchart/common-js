const is = require('./../../../lang/is');

const Parameter = require('./Parameter'),
	Parameters = require('./Parameters'),
	ProtocolType = require('./ProtocolType'),
	VerbType = require('./VerbType');

const ErrorInterceptor = require('./../interceptors/ErrorInterceptor'),
	RequestInterceptor = require('./../interceptors/RequestInterceptor'),
	ResponseInterceptor = require('./../interceptors/ResponseInterceptor');

module.exports = (() => {
	'use strict';

	/**
	 * The definition of a web service endpoint.
	 *
	 * @public
	 * @param {String=} name
	 * @param {String=} description
	 * @param {VerbType=} verb
	 * @param {ProtocolType=} protocol
	 * @param {String=} host
	 * @param {Number=} port
	 * @param {Parameters=} path
	 * @param {Parameters=} query
	 * @param {Parameters=} headers
	 * @param {Parameters=} body
	 * @param {RequestInterceptor} requestInterceptor
	 * @param {ResponseInterceptor} responseInterceptor
	 * @param {ErrorInterceptor} errorInterceptor
	 */
	class Endpoint {
		constructor(name, description, verb, protocol, host, port, path, query, headers, body, requestInterceptor, responseInterceptor, errorInterceptor) {
			this._name = name || null;
			this._description = description || null;
			this._verb = verb || VerbType.GET;
			this._protocol = protocol || ProtocolType.HTTPS;
			this._host = host || null;
			this._port = port || this._protocol.defaultPort;
			this._path = path || new Parameters();
			this._query = query || new Parameters();
			this._headers = headers || new Parameters();
			this._body = body || new Parameters();
			this._requestInterceptor = requestInterceptor || RequestInterceptor.EMPTY;
			this._responseInterceptor = responseInterceptor || ResponseInterceptor.EMPTY;
			this._responseInterceptor = errorInterceptor || ErrorInterceptor.EMPTY;
		}

		/**
		 * The name of the endpoint (used for internal purposes only).
		 *
		 * @public
		 * @returns {String}
		 */
		get name() {
			return this._name;
		}

		/**
		 * A description of the action performed by the endpoint, suitable for display to users.
		 *
		 * @public
		 * @returns {String}
		 */
		get description() {
			return this._description;
		}

		/**
		 * The verb to use when making the request.
		 *
		 * @public
		 * @returns {VerbType}
		 */
		get verb() {
			return this._verb;
		}

		/**
		 * The protocol to use with the endpoint.
		 *
		 * @public
		 * @returns {ProtocolType}
		 */
		get protocol() {
			return this._protocol;
		}

		/**
		 * The host of the endpoint.
		 *
		 * @public
		 * @returns {String}
		 */
		get host() {
			return this._host;
		}

		/**
		 * The host of the endpoint.
		 *
		 * @public
		 * @returns {Number}
		 */
		get port() {
			return this._port;
		}

		/**
		 * The path definition of the endpoint.
		 *
		 * @public
		 * @returns {Parameters}
		 */
		get path() {
			return this._path;
		}

		/**
		 * The query definition of the endpoint.
		 *
		 * @public
		 * @returns {Parameters}
		 */
		get query() {
			return this._query;
		}

		/**
		 * The header definition of the endpoint.
		 *
		 * @public
		 * @returns {Parameters}
		 */
		get headers() {
			return this._headers;
		}

		/**
		 * The body definition of the endpoint.
		 *
		 * @public
		 * @returns {Parameters}
		 */
		get body() {
			return this._body;
		}

		/**
		 * The request interceptor of the endpoint.
		 *
		 * @public
		 * @returns {RequestInterceptor|null}
		 */
		get requestInterceptor() {
			return this._requestInterceptor;
		}

		/**
		 * The response interceptor of the endpoint.
		 *
		 * @public
		 * @returns {ResponseInterceptor|null}
		 */
		get responseInterceptor() {
			return this._responseInterceptor;
		}

		/**
		 * The error interceptor of the endpoint.
		 *
		 * @public
		 * @returns {ErrorInterceptor|null}
		 */
		get errorInterceptor() {
			return this._responseInterceptor;
		}

		/**
		 * Throws an {@link Error} if the instance is invalid.
		 *
		 * @public
		 */
		validate() {
			if (!(this.protocol instanceof ProtocolType)) {
				throw new Error('Endpoint protocol must be an instance of ProtocolType.');
			}

			if (!is.string(this._host) || this._host.length === 0) {
				throw new Error('Endpoint host is invalid.');
			}

			if (!is.integer(this._port) || this._port < 0 || this._port > 65535) {
				throw new Error('Endpoint port range is invalid.');
			}

			if (!(this.path instanceof Parameters)) {
				throw new Error('The path must be a Parameters collection.');
			}

			this.path.validate();

			if (!(this.query instanceof Parameters)) {
				throw new Error('The query must be a Parameters collection.');
			}

			this.query.validate();

			if (!(this.headers instanceof Parameters)) {
				throw new Error('The headers must be a Parameters collection.');
			}

			this.headers.validate();

			if (!(this.body instanceof Parameters)) {
				throw new Error('The body must be a Parameters collection.');
			}

			this.body.validate();

			if (this.requestInterceptor && !(this.requestInterceptor instanceof RequestInterceptor)) {
				throw new Error('Endpoint request interceptor must be an instance of RequestInterceptor.');
			}

			if (this.responseInterceptor && !(this.responseInterceptor instanceof ResponseInterceptor)) {
				throw new Error('Endpoint response interceptor must be an instance of ResponseInterceptor.');
			}

			if (this.errorInterceptor && !(this.errorInterceptor instanceof ErrorInterceptor)) {
				throw new Error('Endpoint error interceptor must be an instance of ErrorInterceptor.');
			}
		}

		toString() {
			return `[Endpoint (name=${this._name})]`;
		}
	}

	return Endpoint;
})();