const is = require('./../../lang/is'),
	DayClazz = require('./../../lang/Day');

const Specification = require('./../Specification');

module.exports = (() => {
	'use strict';

	/**
	 * @public
	 * @extends {Specification}
	 */
	class Day extends Specification {
		constructor() {
			super();
		}

		_evaluate(data) {
			return is.array(data) && data.every(item => item instanceof DayClazz);
		}

		toString() {
			return '[Day]';
		}
	}

	return Day;
})();