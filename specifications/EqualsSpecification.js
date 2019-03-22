const assert = require('./../lang/assert');

const Specification = require('./Specification');

module.exports = (() => {
	'use strict';

	class EqualsSpecification extends Specification {
		constructor(value, dataAccessor, valueAccessor) {
			super();

			assert.argumentIsOptional(dataAccessor, 'dataAccessor', Function);
			assert.argumentIsOptional(valueAccessor, 'valueAccessor', Function);

			this._value = value;

			this._dataAccessor = dataAccessor || ((data) => data);
			this._valueAccessor = valueAccessor || ((data) => this._value);
		}

		_evaluate(data) {
			return this._dataAccessor(data) === this._valueAccessor(data);
		}

		toString() {
			return '[EqualsSpecification]';
		}
	}

	return EqualsSpecification;
})();