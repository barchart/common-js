var assert = require('./../lang/assert');

var Specification = require('./Specification');

module.exports = (() => {
	class GreaterThanSpecification extends Specification {
		constructor(value) {
			super();

			assert.argumentIsRequired(value, 'value', Number);

			this._value = value;
		}

		_evaluate(data) {
			assert.argumentIsRequired(data, 'data', Number);

			return data > this._value;
		}

		toString() {
			return '[GreaterThanSpecification]';
		}
	}

	return GreaterThanSpecification;
})();