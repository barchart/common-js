const Specification = require('./Specification');

module.exports = (() => {
	'use strict';

	/**
	 * A {@link Specification} that always fails.
	 *
	 * @public
	 * @extends {Specification}
	 */
	class Fail extends Specification {
		constructor() {
			super();
		}

		_evaluate(data) {
			return false;
		}

		toString() {
			return '[Fail]';
		}
	}

	return Fail;
})();