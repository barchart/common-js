const is = require('./../../lang/is');

const Specification = require('./../Specification');

module.exports = (() => {
	'use strict';

	/**
	 * A {@link Specification} that passes when the first item in an
	 * array is Day instance that is before second item in the array.
	 *
	 * @public
	 * @extends {Specification}
	 */
	class Before extends Specification {
		constructor() {
			super();
		}

		_evaluate(data) {
			return is.array(data) && data.length === 2 && data[0].getIsBefore(data[1]);
		}

		toString() {
			return '[Before]';
		}
	}

	return Before;
})();