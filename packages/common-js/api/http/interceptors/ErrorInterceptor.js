import * as assert from './../../../lang/assert.js';
import * as is from './../../../lang/is.js';

import FailureReason from './../../failures/FailureReason.js';
import FailureType from './../../failures/FailureType.js';

/**
 * @typedef {import('./../definitions/Endpoint.js').default} Endpoint
 */

/**
 * A processor that transforms web service error before passing
 * it on to the original requestor.
 *
 * @public
 */
export default class ErrorInterceptor {
	constructor() {

	}

	/**
	 * Adjusts incoming error before the response is forwarded
	 * back to the original caller.
	 *
	 * @public
	 * @param {object} error
	 * @param {Endpoint} endpoint - The endpoint which is originating the request.
	 * @returns {Promise<*>}
	 */
	process(error, endpoint) {
		return Promise.resolve()
			.then(() => {
				return this._onProcess(error, endpoint);
			});
	}

	/**
	 * @protected
	 * @param {object} error
	 * @param {Endpoint} endpoint
	 * @returns {Promise<*>}
	 */
	_onProcess(error, endpoint) {
		return Promise.reject(error);
	}

	/**
	 * A no-op error interceptor which rejects using raw response data.
	 *
	 * @public
	 * @static
	 * @returns {ErrorInterceptor}
	 */
	static get EMPTY() {
		return errorInterceptorEmpty;
	}

	/**
	 * An error interceptor that handles most server-side issues and rejects
	 * using formatted {@link FailureReason} when an error is detected.
	 *
	 * @public
	 * @static
	 * @returns {ErrorInterceptor}
	 */
	static get GENERAL() {
		return errorInterceptorGeneral;
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

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[ErrorInterceptor]';
	}
}

class DelegateErrorInterceptor extends ErrorInterceptor {
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
	 * @param {object} error
	 * @param {Endpoint} endpoint
	 * @returns {*}
	 */
	_onProcess(error, endpoint) {
		return this.#delegate(error, endpoint);
	}

	toString() {
		return '[DelegateErrorInterceptor]';
	}
}

const errorInterceptorEmpty = new ErrorInterceptor();

const errorInterceptorGeneral = new DelegateErrorInterceptor((error, endpoint) => {
	const response = error.response;

	let rejectPromise = null;

	if (is.object(response) && is.object(response.headers) && response.headers['content-type'] === 'application/json') {
		let deserialized = null;

		if (is.object(response.data)) {
			deserialized = response.data;
		} else {
			try {
				deserialized = JSON.parse(response.data);
			} catch (e) {
				deserialized = null;
			}
		}

		if (deserialized !== null) {
			rejectPromise = Promise.reject(deserialized);
		}
	}

	if (rejectPromise === null && is.undef(response) && error.message === 'Network Error') {
		rejectPromise = Promise.reject(
			FailureReason.forRequest({endpoint: endpoint})
				.addItem(FailureType.REQUEST_AUTHORIZATION_FAILURE)
				.format()
		);
	}

	if (rejectPromise === null) {
		rejectPromise = Promise.reject(
			FailureReason.forRequest({endpoint: endpoint})
				.addItem(FailureType.REQUEST_GENERAL_FAILURE)
				.format()
		);
	}

	return rejectPromise;
});
