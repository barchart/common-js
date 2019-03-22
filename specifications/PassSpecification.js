const Specification = require('./Specification');

module.exports = (() => {
	'use strict';

	class PassSpecification extends Specification {
		constructor() {
			super();
		}

		_evaluate(data) {
			return true;
		}

		toString() {
			return '[PassSpecification]';
		}
	}

	return PassSpecification;
})();