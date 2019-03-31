const Specification = require('./Specification');

module.exports = (() => {
	'use strict';

	/**
	 * A {@link Specification} that always passes.
	 *
	 * @public
	 * @extends {Specification}
	 */
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