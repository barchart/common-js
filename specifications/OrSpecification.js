var assert = require('./../lang/assert');

var Specification = require('./Specification');

module.exports = (() => {
	class OrSpecification extends Specification {
		constructor(specificationOne, specificationTwo) {
			assert.argumentIsRequired(specificationOne, 'specificationOne', Specification, 'Specification');
			assert.argumentIsRequired(specificationTwo, 'specificationTwo', Specification, 'Specification');

			this._super();

			this._specificationOne = specificationOne;
			this._specificationTwo = specificationTwo;
		}

		_evaluate(data) {
			return this._specificationOne.evaluate(data) || this._specificationTwo.evaluate(data);
		}

		toString() {
			return '[OrSpecification]';
		}
	}

	return OrSpecification;
})();