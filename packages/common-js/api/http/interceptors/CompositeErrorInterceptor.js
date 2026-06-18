import * as assert from './../../../lang/assert.js';

import ErrorInterceptor from './ErrorInterceptor.js';

/**
 * A {@link ErrorInterceptor} that delegates work to two other instances.
 *
 * @public
 * @extends {ErrorInterceptor}
 */
export default class CompositeErrorInterceptor extends ErrorInterceptor {
	#a;
	#b;

	/**
	 * @param {ErrorInterceptor} a - The first interceptor to process.
	 * @param {ErrorInterceptor} b - The second interceptor to process.
	 */
	constructor(a, b) {
		super();

		assert.argumentIsRequired(a, 'a', ErrorInterceptor, 'ErrorInterceptor');
		assert.argumentIsRequired(b, 'b', ErrorInterceptor, 'ErrorInterceptor');

		this.#a = a;
		this.#b = b;
	}

	_onProcess(error, endpoint) {
		return this.#a.process(error, endpoint)
			.catch((adjusted) => {
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
		return '[CompositeErrorInterceptor]';
	}
}
