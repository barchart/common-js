const is = require('./../lang/is');

const Specification = require('./Specification');

module.exports = (() => {
	'use strict';

	/**
	 * A {@link Specification} that passes when a data item is a null value.
	 *
	 * @public
	 * @extends {Specification}
	 */
	class Null extends Specification {
		constructor() {
			super();
		}

		_evaluate(data) {
			return is.null(data);
		}

		toString() {
			return '[Null]';
		}
	}

	return Null;
})();


