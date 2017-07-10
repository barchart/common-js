const is = require('./../lang/is');

const Specification = require('./Specification');

module.exports = (() => {
	'use strict';

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