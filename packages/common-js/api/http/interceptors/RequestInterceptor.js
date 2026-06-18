import * as assert from './../../../lang/assert.js';

/**
 * @typedef {import('./../definitions/Endpoint.js').default} Endpoint
 */

/**
 * A processor that transforms a web service request before it is transmitted.
 *
 * @public
 */
export default class RequestInterceptor {
	constructor() {

	}

	/**
	 * Adjusts outgoing requests data before the request is transmitted.
	 *
	 * @public
	 * @param {object} request
	 * @param {Endpoint} endpoint - The endpoint which is originating the request.
	 * @returns {Promise<*>}
	 */
	process(request, endpoint) {
		return Promise.resolve()
			.then(() => {
				return this._onProcess(request, endpoint);
			});
	}

	/**
	 * @protected
	 * @param {object} request
	 * @param {Endpoint} endpoint
	 * @returns {*}
	 */
	_onProcess(request, endpoint) {
		return request;
	}

	/**
	 * A no-op request interceptor.
	 *
	 * @public
	 * @static
	 * @returns {RequestInterceptor}
	 */
	static get EMPTY() {
		return requestInterceptorEmpty;
	}

	/**
	 * Returns a new {@link RequestInterceptor} which delegates its work to another function.
	 *
	 * @public
	 * @static
	 * @param {Function} delegate
	 * @returns {RequestInterceptor}
	 */
	static fromDelegate(delegate) {
		return new DelegateRequestInterceptor(delegate);
	}

	/**
	 * A request interceptor that instructs the framework to skip parsing
	 * of the response's data.
	 *
	 * @public
	 * @static
	 * @returns {RequestInterceptor}
	 */
	static get PLAIN_TEXT_RESPONSE() {
		return requestInterceptorPlain;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[RequestInterceptor]';
	}
}

class DelegateRequestInterceptor extends RequestInterceptor {
	#delegate;

	/**
	 * @param {Function} delegate
	 */
	constructor(delegate) {
		super();

		assert.argumentIsRequired(delegate, 'delegate', Function);

		this.#delegate = delegate;
	}

	/**
	 * @protected
	 * @override
	 * @param {object} request
	 * @param {Endpoint} endpoint
	 * @returns {*}
	 */
	_onProcess(request, endpoint) {
		return this.#delegate(request, endpoint);
	}

	toString() {
		return '[DelegateRequestInterceptor]';
	}
}

const requestInterceptorEmpty = new RequestInterceptor();

const requestInterceptorPlain = new DelegateRequestInterceptor((request) => {
	request.transformResponse = (data) => data;

	return request;
});
