const is = require('./../../lang/is');

const Specification = require('./../Specification');

module.exports = (() => {
	'use strict';

	/**
	 * @public
	 * @extends {Specification}
	 */
	class Numeric extends Specification {
		constructor() {
			super();
		}

		_evaluate(data) {
			return is.array(data) && data.every(item => is.number(item));
		}

		toString() {
			return '[Numeric]';
		}
	}

	return Numeric;
})();