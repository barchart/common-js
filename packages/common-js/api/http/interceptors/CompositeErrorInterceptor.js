import * as assert from './../../../lang/assert.js';

import ErrorInterceptor from './ErrorInterceptor.js';

/**
 * A {@link ErrorInterceptor} that delegates work to two other instances.
 *
 * @public
 * @extends {ErrorInterceptor}
 * @param {ErrorInterceptor} a - The first interceptor to process.
 * @param {ErrorInterceptor} b - The second interceptor to process.
 */
export default class CompositeErrorInterceptor extends ErrorInterceptor {
	constructor(a, b) {
		super();

		assert.argumentIsRequired(a, 'a', ErrorInterceptor, 'ErrorInterceptor');
		assert.argumentIsRequired(b, 'b', ErrorInterceptor, 'ErrorInterceptor');

		this._a = a;
		this._b = b;
	}

	_onProcess(error, endpoint) {
		return this._a.process(error, endpoint)
			.catch((adjusted) => {
				return this._b.process(adjusted, endpoint);
			});
	}

	toString() {
		return '[CompositeErrorInterceptor]';
	}
}
