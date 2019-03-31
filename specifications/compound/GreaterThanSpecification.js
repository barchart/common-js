const assert = require('./../../lang/assert');

const Specification = require('./../Specification');

module.exports = (() => {
	'use strict';

	/**
	 * A specification that determines if the first value
	 * in an array is greater than the second value of an
	 * array.
	 *
	 * @public
	 * @extends {Specification}
	 */
	class GreaterThanSpecification extends Specification {
		constructor() {
			super();
		}

		_evaluate(data) {
			assert.argumentIsArray(data, 'data', Number);

			return data.length === 2 && data[0] > data[1];
		}

		toString() {
			return '[GreaterThanSpecification]';
		}
	}

	return GreaterThanSpecification;
})();