import * as is from './../../../lang/is.js';

import Parameters from './Parameters.js';
import ProtocolType from './ProtocolType.js';
import VerbType from './VerbType.js';

import ErrorInterceptor from './../interceptors/ErrorInterceptor.js';
import RequestInterceptor from './../interceptors/RequestInterceptor.js';
import ResponseInterceptor from './../interceptors/ResponseInterceptor.js';

/**
 * @typedef {import('./Credentials.js').default} Credentials
 */

/**
 * The definition of a web service endpoint.
 *
 * @public
 */
export default class Endpoint {
	#name;
	#description;
	#verb;
	#protocol;
	#host;
	#port;
	#path;
	#query;
	#headers;
	#body;
	#credentials;
	#requestInterceptor;
	#responseInterceptor;
	#errorInterceptor;

	/**
	 * @param {string=} name
	 * @param {string=} description
	 * @param {VerbType=} verb
	 * @param {ProtocolType=} protocol
	 * @param {string=} host
	 * @param {number=} port
	 * @param {Parameters=} path
	 * @param {Parameters=} query
	 * @param {Parameters=} headers
	 * @param {Parameters=} body
	 * @param {Credentials=} credentials
	 * @param {RequestInterceptor=} requestInterceptor
	 * @param {ResponseInterceptor=} responseInterceptor
	 * @param {ErrorInterceptor=} errorInterceptor
	 */
	constructor(name, description, verb, protocol, host, port, path, query, headers, body, credentials, requestInterceptor, responseInterceptor, errorInterceptor) {
		this.#name = name || null;
		this.#description = description || null;
		this.#verb = verb || VerbType.GET;
		this.#protocol = protocol || ProtocolType.HTTPS;
		this.#host = host || null;
		this.#port = port || this.#protocol.defaultPort;
		this.#path = path || new Parameters();
		this.#query = query || new Parameters();
		this.#headers = headers || new Parameters();
		this.#body = body || new Parameters();
		this.#credentials = credentials || null;
		this.#requestInterceptor = requestInterceptor || RequestInterceptor.EMPTY;
		this.#responseInterceptor = responseInterceptor || ResponseInterceptor.EMPTY;
		this.#errorInterceptor = errorInterceptor || ErrorInterceptor.EMPTY;
	}

	/**
	 * The name of the endpoint (used for internal purposes only).
	 *
	 * @public
	 * @returns {string}
	 */
	get name() {
		return this.#name;
	}

	/**
	 * A description of the action performed by the endpoint, suitable for display to users.
	 *
	 * @public
	 * @returns {string}
	 */
	get description() {
		return this.#description;
	}

	/**
	 * The verb to use when making the request.
	 *
	 * @public
	 * @returns {VerbType}
	 */
	get verb() {
		return this.#verb;
	}

	/**
	 * The protocol to use with the endpoint.
	 *
	 * @public
	 * @returns {ProtocolType}
	 */
	get protocol() {
		return this.#protocol;
	}

	/**
	 * The host of the endpoint.
	 *
	 * @public
	 * @returns {string}
	 */
	get host() {
		return this.#host;
	}

	/**
	 * The host of the endpoint.
	 *
	 * @public
	 * @returns {number}
	 */
	get port() {
		return this.#port;
	}

	/**
	 * The path definition of the endpoint.
	 *
	 * @public
	 * @returns {Parameters}
	 */
	get path() {
		return this.#path;
	}

	/**
	 * The query definition of the endpoint.
	 *
	 * @public
	 * @returns {Parameters}
	 */
	get query() {
		return this.#query;
	}

	/**
	 * The header definition of the endpoint.
	 *
	 * @public
	 * @returns {Parameters}
	 */
	get headers() {
		return this.#headers;
	}

	/**
	 * The body definition of the endpoint.
	 *
	 * @public
	 * @returns {Parameters}
	 */
	get body() {
		return this.#body;
	}

	/**
	 * Credentials for the request.
	 *
	 * @public
	 * @return {Credentials}
	 */
	get credentials() {
		return this.#credentials;
	}

	/**
	 * The request interceptor of the endpoint.
	 *
	 * @public
	 * @returns {RequestInterceptor|null}
	 */
	get requestInterceptor() {
		return this.#requestInterceptor;
	}

	/**
	 * The response interceptor of the endpoint.
	 *
	 * @public
	 * @returns {ResponseInterceptor|null}
	 */
	get responseInterceptor() {
		return this.#responseInterceptor;
	}

	/**
	 * The error interceptor of the endpoint.
	 *
	 * @public
	 * @returns {ErrorInterceptor|null}
	 */
	get errorInterceptor() {
		return this.#errorInterceptor;
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

		if (!is.string(this.#host) || this.#host.length === 0) {
			throw new Error('Endpoint host is invalid.');
		}

		if (!is.integer(this.#port) || this.#port < 0 || this.#port > 65535) {
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

		if (this.credentials) {
			this.credentials.validate();
		}

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

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return `[Endpoint (name=${this.#name})]`;
	}
}
