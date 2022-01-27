const is = require('./../lang/is');

const Specification = require('./Specification');

module.exports = (() => {
	'use strict';

	/**
	 * A {@link Specification} that passes when a data item is an undefined value.
	 *
	 * @public
	 * @extends {Specification}
	 */
	class Undefined extends Specification {
		constructor() {
			super();
		}

		_evaluate(data) {
			return is.undefined(data);
		}

		toString() {
			return '[Undefined]';
		}
	}

	return Undefined;
})();


