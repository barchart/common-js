const assert = require('./../../../lang/assert'),
	is = require('./../../../lang/is');

const ResponseInterceptor = require('./ResponseInterceptor');

module.exports = (() => {
	'use strict';

	/**
	 * A {@link ResponseInterceptor} that delegates work to two other instances.
	 *
	 * @public
	 * @extends {ResponseInterceptor}
	 * @param {ResponseInterceptor} a - The first interceptor to process.
	 * @param {ResponseInterceptor} b - The second interceptor to process.
	 */
	class CompositeResponseInterceptor extends ResponseInterceptor {
		constructor(a, b) {
			super();

			assert.argumentIsRequired(a, 'a', ResponseInterceptor, 'ResponseInterceptor');
			assert.argumentIsRequired(b, 'b', ResponseInterceptor, 'ResponseInterceptor');

			this._a = a;
			this._b = b;
		}

		_onProcess(response) {
			return this._a.process(response)
				.then((adjusted) => {
					return this._b.process(adjusted);
				});
		}

		toString() {
			return `[CompositeResponseInterceptor]`;
		}
	}

	return CompositeResponseInterceptor;
})();