const assert = require('./../../../lang/assert');

const RequestInterceptor = require('./RequestInterceptor');

module.exports = (() => {
	'use strict';

	/**
	 * A {@link ResponseInterceptor} that delegates work to two other instances.
	 *
	 * @public
	 * @extends {RequestInterceptor}
	 * @param {RequestInterceptor} a - The first interceptor to process.
	 * @param {RequestInterceptor} b - The second interceptor to process.
	 */
	class CompositeRequestInterceptor extends RequestInterceptor {
		constructor(a, b) {
			super();

			assert.argumentIsRequired(a, 'a', RequestInterceptor, 'RequestInterceptor');
			assert.argumentIsRequired(b, 'b', RequestInterceptor, 'RequestInterceptor');

			this._a = a;
			this._b = b;
		}

		_onProcess(request, endpoint) {
			return this._a.process(request, endpoint)
				.then((adjusted) => {
					return this._b.process(adjusted, endpoint);
				});
		}

		toString() {
			return '[CompositeRequestInterceptor]';
		}
	}

	return CompositeRequestInterceptor;
})();