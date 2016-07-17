var Specification = require('./Specification');

module.exports = (() => {
	class FailSpecification extends Specification {
		constructor(value) {
			super();
		}

		_evaluate(data) {
			return false;
		}

		toString() {
			return '[FailSpecification]';
		}
	}

	return FailSpecification;
})();