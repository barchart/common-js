const is = require('./../lang/is');

const Specification = require('./Specification');

module.exports = (() => {
	'use strict';

	/**
	 * A {@link Specification} that passes when the value of the data item
	 * is NaN.
	 *
	 * @public
	 * @extends {Specification}
	 * @param {*} value
	 */
	class NanSpecification extends Specification {
		constructor() {
			super();
		}

		_evaluate(data) {
			return is.nan(data);
		}

		toString() {
			return '[NanSpecification]';
		}
	}

	return NanSpecification;
})();