const is = require('./../lang/is');

const Specification = require('./Specification');

module.exports = (() => {
	'use strict';

	/**
	 * A {@link Specification} that passes when a data item evaluates to NaN.
	 *
	 * @public
	 * @extends {Specification}
	 */
	class Nan extends Specification {
		constructor() {
			super();
		}

		_evaluate(data) {
			return is.nan(data);
		}

		toString() {
			return '[Nan]';
		}
	}

	return Nan;
})();