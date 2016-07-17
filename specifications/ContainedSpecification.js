var assert = require('./../lang/assert');

var Specification = require('./Specification');

module.exports = (() => {
	'use strict';

	class ContainedSpecification extends Specification {
		constructor(value) {
			super();

			assert.argumentIsArray(value, 'value');

			this._value = value;
		}

		_evaluate(data) {
			return this._value.some((candidate) => candidate === data);
		}

		toString() {
			return '[ContainedSpecification]';
		}
	}

	return ContainedSpecification;
})();