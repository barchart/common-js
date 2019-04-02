const Specification = require('./Specification');

module.exports = (() => {
	'use strict';

	/**
	 * A {@link Specification} that always passes.
	 *
	 * @public
	 * @extends {Specification}
	 */
	class Pass extends Specification {
		constructor() {
			super();
		}

		_evaluate(data) {
			return true;
		}

		toString() {
			return '[Pass]';
		}
	}

	return Pass;
})();