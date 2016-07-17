var _ = require('lodash');

var assert = require('./../lang/assert');

var Specification = require('./Specification');

module.exports = (() => {
	class ContainedSpecification extends Specification {
		constructor(value) {
			super();

			assert.argumentIsArray(value, 'value');

			this._value = value;
		}

		_evaluate(data) {
			return _.contains(this._value, data);
		}

		toString() {
			return '[ContainedSpecification]';
		}
	}

	return ContainedSpecification;
})();