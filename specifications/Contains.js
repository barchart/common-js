const Specification = require('./Specification');

module.exports = (() => {
	'use strict';

	/**
	 * A {@link Specification} that passes when an item (passed to the
	 * constructor) is contained within an array passed as the data item.
	 *
	 * @public
	 * @extends {Specification}
	 * @param {*} value
	 */
	class Contains extends Specification {
		constructor(value) {
			super();

			this._value = value;
		}

		_evaluate(data) {
			return Array.isArray(data) && data.some((candidate) => candidate === this._value);
		}

		toString() {
			return '[Contains]';
		}
	}

	return Contains;
})();