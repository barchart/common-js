import * as assert from './../../../lang/assert.js';

import ResponseInterceptor from './ResponseInterceptor.js';

/**
 * A {@link ResponseInterceptor} that delegates work to two other instances.
 *
 * @public
 * @extends {ResponseInterceptor}
 * @param {ResponseInterceptor} a - The first interceptor to process.
 * @param {ResponseInterceptor} b - The second interceptor to process.
 */
export default class CompositeResponseInterceptor extends ResponseInterceptor {
	constructor(a, b) {
		super();

		assert.argumentIsRequired(a, 'a', ResponseInterceptor, 'ResponseInterceptor');
		assert.argumentIsRequired(b, 'b', ResponseInterceptor, 'ResponseInterceptor');

		this._a = a;
		this._b = b;
	}

	_onProcess(response, endpoint) {
		return this._a.process(response, endpoint)
			.then((adjusted) => {
				return this._b.process(adjusted, endpoint);
			});
	}

	toString() {
		return '[CompositeResponseInterceptor]';
	}
}
