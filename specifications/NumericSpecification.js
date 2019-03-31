const is = require('./../lang/is');

const Specification = require('./Specification');

module.exports = (() => {
	'use strict';

	/**
	 * A {@link Specification} that passes when the value of the data item
	 * is a number.
	 *
	 * @public
	 * @extends {Specification}
	 * @param {*} value
	 */
	class NumericSpecification extends Specification {
		constructor() {
			super();
		}

		_evaluate(data) {
			return is.number(data);
		}

		toString() {
			return '[NumericSpecification]';
		}
	}

	return NumericSpecification;
})();