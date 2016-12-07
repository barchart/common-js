var is = require('./../lang/is');

var Specification = require('./Specification');

module.exports = (() => {
	'use strict';

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