const assert = require('./../../../lang/assert'),
	is = require('./../../../lang/is');

module.exports = (() => {
	'use strict';

	/**
	 * A processor that transforms a web service request before it is transmitted.
	 *
	 * @public
	 * @interface
	 */
	class RequestInterceptor {
		constructor() {

		}

		/**
		 * Adjusts outgoing requests data before the request is transmitted.
		 *
		 * @public
		 * @param {Object} request
		 * @param {Endpoint} endpoint - The endpoint which is originating the request.
		 * @returns {Promise.<TResult>}
		 */
		process(request, endpoint) {
			return Promise.resolve()
				.then(() => {
					return this._onProcess(request);
				});
		}

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
		 * @return {DelegateRequestInterceptor}
		 */
		static get PLAIN_TEXT_RESPONSE() {
			return requestInterceptorPlain;
		}

		toString() {
			return '[RequestInterceptor]';
		}
	}

	class DelegateRequestInterceptor extends RequestInterceptor {
		constructor(delegate) {
			super();

			assert.argumentIsRequired(delegate, 'delegate', Function);

			this._delegate = delegate;
		}

		_onProcess(request, endpoint) {
			return this._delegate(request, endpoint);
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

	return RequestInterceptor;
})();