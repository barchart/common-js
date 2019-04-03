const is = require('./../../lang/is');

const Specification = require('./../Specification');

module.exports = (() => {
	'use strict';

	/**
	 * A {@link Specification} that passes when the input is an array
	 * with two items.
	 *
	 * @public
	 * @extends {Specification}
	 */
	class Numeric extends Specification {
		constructor() {
			super();
		}

		_evaluate(data) {
			return Array.isArray(data) && data.every(item => is.number(item));
		}

		toString() {
			return '[Numeric]';
		}
	}

	return Numeric;
})();