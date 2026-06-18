import * as assert from './../../../lang/assert.js';

import ResponseInterceptor from './ResponseInterceptor.js';

/**
 * @typedef {import('./../definitions/Endpoint.js').default} Endpoint
 */

/**
 * A {@link ResponseInterceptor} that delegates work to two other instances.
 *
 * @public
 * @extends {ResponseInterceptor}
 */
export default class CompositeResponseInterceptor extends ResponseInterceptor {
	#a;
	#b;

	/**
	 * @param {ResponseInterceptor} a - The first interceptor to process.
	 * @param {ResponseInterceptor} b - The second interceptor to process.
	 */
	constructor(a, b) {
		super();

		assert.argumentIsRequired(a, 'a', ResponseInterceptor, 'ResponseInterceptor');
		assert.argumentIsRequired(b, 'b', ResponseInterceptor, 'ResponseInterceptor');

		this.#a = a;
		this.#b = b;
	}

	/**
	 * @protected
	 * @override
	 * @param {object} response
	 * @param {Endpoint} endpoint
	 * @returns {Promise<*>}
	 */
	_onProcess(response, endpoint) {
		return this.#a.process(response, endpoint)
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
		return '[CompositeResponseInterceptor]';
	}
}
