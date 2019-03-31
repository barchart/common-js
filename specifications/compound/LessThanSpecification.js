const assert = require('./../../lang/assert');

const Specification = require('./../Specification');

module.exports = (() => {
	'use strict';

	/**
	 * A specification that determines if the first value
	 * in an array is less than the second value of an
	 * an array.
	 *
	 * @public
	 * @extends {Specification}
	 */
	class LessThanSpecification extends Specification {
		constructor() {
			super();
		}

		_evaluate(data) {
			assert.argumentIsArray(data, 'data', Number);

			return data.length === 2 && data[0] < data[1];
		}

		toString() {
			return '[LessThanSpecification]';
		}
	}

	return LessThanSpecification;
})();