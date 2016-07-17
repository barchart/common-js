var Specification = require('./Specification');

module.exports = (() => {
	class EqualsSpecification extends Specification {
		constructor(value) {
			super();

			this._value = value;
		}

		_evaluate(data) {
			return data === this._value;
		}

		toString() {
			return '[EqualsSpecification]';
		}
	}

	return EqualsSpecification;
})();