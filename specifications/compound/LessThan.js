const assert = require('./../../lang/assert');

const Specification = require('./../Specification');

module.exports = (() => {
	'use strict';

	/**
	 * A {@link Specification} that passes when the first item in an
	 * array is less than the second item in the array.
	 *
	 * @public
	 * @extends {Specification}
	 */
	class LessThan extends Specification {
		constructor() {
			super();
		}

		_evaluate(data) {
			assert.argumentIsArray(data, 'data', Number);

			return data.length === 2 && data[0] < data[1];
		}

		toString() {
			return '[LessThan]';
		}
	}

	return LessThan;
})();