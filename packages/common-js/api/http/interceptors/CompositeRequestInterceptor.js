import * as assert from './../../../lang/assert.js';

import RequestInterceptor from './RequestInterceptor.js';

/**
 * @typedef {import('./../definitions/Endpoint.js').default} Endpoint
 */

/**
 * A {@link RequestInterceptor} that delegates work to two other instances.
 *
 * @public
 * @extends {RequestInterceptor}
 */
export default class CompositeRequestInterceptor extends RequestInterceptor {
	#a;
	#b;

	/**
	 * @param {RequestInterceptor} a - The first interceptor to process.
	 * @param {RequestInterceptor} b - The second interceptor to process.
	 */
	constructor(a, b) {
		super();

		assert.argumentIsRequired(a, 'a', RequestInterceptor, 'RequestInterceptor');
		assert.argumentIsRequired(b, 'b', RequestInterceptor, 'RequestInterceptor');

		this.#a = a;
		this.#b = b;
	}

	/**
	 * @protected
	 * @override
	 * @param {object} request
	 * @param {Endpoint} endpoint
	 * @returns {Promise<*>}
	 */
	_onProcess(request, endpoint) {
		return this.#a.process(request, endpoint)
			.then((adjusted) => {
				return this.#b.process(adjusted, endpoint);
			});
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[CompositeRequestInterceptor]';
	}
}
