var assert = require('./../lang/assert');

var Specification = require('./Specification');

module.exports = (() => {
	class AndSpecification extends Specification {
		constructor(specificationOne, specificationTwo) {
			super();

			assert.argumentIsRequired(specificationOne, 'specificationOne', Specification, 'Specification');
			assert.argumentIsRequired(specificationTwo, 'specificationTwo', Specification, 'Specification');

			this._specificationOne = specificationOne;
			this._specificationTwo = specificationTwo;
		}

		_evaluate(data) {
			return this._specificationOne.evaluate(data) && this._specificationTwo.evaluate(data);
		}

		toString() {
			return '[AndSpecification]';
		}
	}

	return AndSpecification;
})();