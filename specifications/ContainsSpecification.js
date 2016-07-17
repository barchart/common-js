var Specification = require('./Specification');

module.exports = (() => {
	class ContainsSpecification extends Specification{
		constructor(value) {
			super();

			this._value = value;
		}

		_evaluate(data) {
			return Array.isArray(data) && data.includes(this._value);
		}

		toString() {
			return '[ContainsSpecification]';
		}
	}

	return ContainsSpecification;
})();