const assert = require('./../../../lang/assert'),
	is = require('./../../../lang/is');

const FailureReason = require('./../../failures/FailureReason'),
	FailureType = require('./../../failures/FailureType');

module.exports = (() => {
	'use strict';

	/**
	 * A processor that transforms web service error before passing
	 * it on to the original requestor.
	 *
	 * @public
	 * @interface
	 */
	class ErrorInterceptor {
		constructor() {

		}

		/**
		 * Adjusts incoming error before the response is forwarded
		 * back to the original caller.
		 *
		 * @public
		 * @param {Object} error
		 * @param {Endpoint} endpoint - The endpoint which is originating the request.
		 * @returns {Promise.<TResult>}
		 */
		process(error, endpoint) {
			return Promise.resolve()
				.then(() => {
					return this._onProcess(error, endpoint);
				});
		}

		_onProcess(error, endpoint) {
			return Promise.reject(error);
		}

		/**
		 * A no-op error interceptor (which will return the raw response).
		 *
		 * @public
		 * @static
		 * @returns {ErrorInterceptor}
		 */
		static get EMPTY() {
			return errorInterceptorEmpty;
		}

		/**
		 * An error interceptor to handle unauthorized and forbidden responses
		 * from a typical Lambda (custom authorizer).
		 *
		 * @public
		 * @static
		 * @returns {ErrorInterceptor}
		 */
		static get LAMBDA_CUSTOM_AUTHORIZER() {
			return errorInterceptorLambda;
		}

		/**
		 * Returns a new {@link ErrorInterceptor} which delegates its work to another function.
		 *
		 * @public
		 * @static
		 * @param {Function} delegate
		 * @returns {ErrorInterceptor}
		 */
		static fromDelegate(delegate) {
			return new DelegateErrorInterceptor(delegate);
		}

		toString() {
			return '[ErrorInterceptor]';
		}
	}

	class DelegateErrorInterceptor extends ErrorInterceptor {
		constructor(delegate) {
			super();

			assert.argumentIsRequired(delegate, 'delegate', Function);

			this._delegate = delegate;
		}

		_onProcess(response, endpoint) {
			return this._delegate(response, endpoint);
		}

		toString() {
			return '[DelegateErrorInterceptor]';
		}
	}

	const errorInterceptorEmpty = new ErrorInterceptor();

	const errorInterceptorLambda = new DelegateErrorInterceptor((error, endpoint) => {
		if (is.undefined(error.response) && error.message === 'Network Error') {
			const failure = FailureReason.forRequest({ endpoint: endpoint })
				.addItem(FailureType.REQUEST_AUTHORIZATION_FAILURE)
				.format();

			return Promise.reject(failure);
		} else {
			return Promise.reject(error);
		}
	});

	return ErrorInterceptor;
})();