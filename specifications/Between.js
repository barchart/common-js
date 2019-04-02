const assert = require('./../lang/assert');

const Specification = require('./Specification');

module.exports = (() => {
	'use strict';

	/**
	 * A {@link Specification} that passes when the value of the data item
	 * is between the values passed to the constructor
	 *
	 * @public
	 * @extends {Specification}
	 * @param {Number} value
	 */
	class Between extends Specification {
		constructor(values) {
			super();

			assert.argumentIsArray(values, 'values', Number);

			this._values = values;
		}

		_evaluate(data) {
			assert.argumentIsRequired(data, 'data', Number);

			return data > this._values[0] && data < this._values[1];
		}

		toString() {
			return '[Between]';
		}
	}

	return Between;
})();