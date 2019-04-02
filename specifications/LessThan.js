const assert = require('./../lang/assert');

const Specification = require('./Specification');

module.exports = (() => {
	'use strict';

	/**
	 * A {@link Specification} that passes when the value of the item passed to
	 * the constructor exceeds the value of the data item.
	 *
	 * @public
	 * @extends {Specification}
	 * @param {Number} value
	 */
	class LessThan extends Specification {
		constructor(value) {
			super();

			assert.argumentIsRequired(value, 'value', Number);

			this._value = value;
		}

		_evaluate(data) {
			assert.argumentIsRequired(data, 'data', Number);

			return data < this._value;
		}

		toString() {
			return '[LessThan]';
		}
	}

	return LessThan;
})();