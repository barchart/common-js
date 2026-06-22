import * as assert from './../../../lang/assert.js';

/**
 * @typedef {import('./../definitions/Endpoint.js').default} Endpoint
 */

/**
 * A processor that transforms web service response before passing
 * it on to the original requestor.
 *
 * @public
 */
export default class ResponseInterceptor {
	constructor() {

	}

	/**
	 * Adjusts incoming response data before the response is forwarded
	 * back to the original caller.
	 *
	 * @public
	 * @async
	 * @param {object} response
	 * @param {Endpoint} endpoint - The endpoint which is originating the request.
	 * @returns {Promise<*>}
	 */
	async process(response, endpoint) {
		return this._onProcess(response, endpoint);
	}

	/**
	 * @protected
	 * @param {object} response
	 * @param {Endpoint} endpoint
	 * @returns {*}
	 */
	_onProcess(response, endpoint) {
		return response;
	}

	/**
	 * A no-op request interceptor (which will return the raw response).
	 *
	 * @public
	 * @static
	 * @returns {ResponseInterceptor}
	 */
	static get EMPTY() {
		return responseInterceptorEmpty;
	}

	/**
	 * A response interceptor returns only the data payload in the format
	 * specified by the response's "content-type" header.
	 *
	 * @public
	 * @static
	 * @returns {ResponseInterceptor}
	 */
	static get DATA() {
		return responseInterceptorData;
	}

	/**
	 * Returns a new {@link ResponseInterceptor} which delegates its work to another function.
	 *
	 * @public
	 * @static
	 * @param {Function} delegate
	 * @returns {ResponseInterceptor}
	 */
	static fromDelegate(delegate) {
		return new DelegateResponseInterceptor(delegate);
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[ResponseInterceptor]';
	}
}

class DelegateResponseInterceptor extends ResponseInterceptor {
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
	 * @param {object} response
	 * @param {Endpoint} endpoint
	 * @returns {*}
	 */
	_onProcess(response, endpoint) {
		return this.#delegate(response, endpoint);
	}

	toString() {
		return '[DelegateResponseInterceptor]';
	}
}

const responseInterceptorEmpty = new ResponseInterceptor();

const responseInterceptorData = new DelegateResponseInterceptor((response, ignored) => {
	return response.data;
});
