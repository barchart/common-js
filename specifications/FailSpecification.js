const Specification = require('./Specification');

module.exports = (() => {
	'use strict';

	/**
	 * A {@link Specification} that always fails.
	 *
	 * @public
	 * @extends {Specification}
	 */
	class FailSpecification extends Specification {
		constructor() {
			super();
		}

		_evaluate(data) {
			return false;
		}

		toString() {
			return '[FailSpecification]';
		}
	}

	return FailSpecification;
})();