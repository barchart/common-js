const is = require('./../../lang/is');

const Specification = require('./../Specification');

module.exports = (() => {
	'use strict';

	/**
	 * A {@link Specification} that passes when the first item in an
	 * array is greater than the second item in the array.
	 *
	 * @public
	 * @extends {Specification}
	 */
	class GreaterThan extends Specification {
		constructor() {
			super();
		}

		_evaluate(data) {
			return is.array(data) && data.length === 2 && data[0] > data[1];
		}

		toString() {
			return '[GreaterThan]';
		}
	}

	return GreaterThan;
})();