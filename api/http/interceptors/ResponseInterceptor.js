const assert = require('./../../../lang/assert'),
	is = require('./../../../lang/is');

module.exports = (() => {
	'use strict';

	/**
	 * A processor that transforms web service response before passing
	 * it on to the original requestor.
	 *
	 * @public
	 * @interface
	 */
	class ResponseInterceptor {
		constructor() {

		}

		/**
		 * Adjusts incoming response data before the response is forwarded
		 * back to the original caller.
		 *
		 * @public
		 * @param {Object} request
		 * @param {Endpoint} endpoint - The endpoint which is originating the request.
		 * @returns {Promise.<TResult>}
		 */
		process(response, endpoint) {
			return Promise.resolve()
				.then(() => {
					return this._onProcess(response, endpoint);
				});
		}

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

		toString() {
			return `[ResponseInterceptor]`;
		}
	}

	class DelegateResponseInterceptor extends ResponseInterceptor {
		constructor(delegate) {
			super();

			assert.argumentIsRequired(delegate, 'delegate', Function);

			this._delegate = delegate;
		}

		_onProcess(response, endpoint) {
			return this._delegate(response, endpoint);
		}

		toString() {
			return `[DelegateResponseInterceptor]`;
		}
	}

	const responseInterceptorEmpty = new ResponseInterceptor();

	const responseInterceptorData = new DelegateResponseInterceptor((response, ignored) => {
		return response.data;
	});

	return ResponseInterceptor;
})();