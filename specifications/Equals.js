const Specification = require('./Specification');

module.exports = (() => {
	'use strict';

	/**
	 * A {@link Specification} that passes when an item (passed to the
	 * constructor) is strictly equal to the data item.
	 *
	 * @public
	 * @extends {Specification}
	 * @param {*} value
	 */
	class Equals extends Specification {
		constructor(value) {
			super();

			this._value = value;
		}

		_evaluate(data) {
			return data === this._value;
		}

		toString() {
			return '[Equals]';
		}
	}

	return Equals;
})();