const Specification = require('./Specification');

module.exports = (() => {
	'use strict';

	class ContainsSpecification extends Specification {
		constructor(value) {
			super();

			this._value = value;
		}

		_evaluate(data) {
			return Array.isArray(data) && data.some((candidate) => candidate === this._value);
		}

		toString() {
			return '[ContainsSpecification]';
		}
	}

	return ContainsSpecification;
})();