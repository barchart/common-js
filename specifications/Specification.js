var assert = require('./../lang/assert');

module.exports = (() => {
	'use strict';

	class Specification {
		constructor() {

		}

		evaluate(data) {
			return this._evaluate(data);
		}

		_evaluate(data) {
			return false;
		}

		and(other) {
			assert.argumentIsRequired(other, 'other', Specification, 'Specification');

			return new AndSpecification(this, other);
		}

		or(other) {
			assert.argumentIsRequired(other, 'other', Specification, 'Specification');

			return new OrSpecification(this, other);
		}

		toString() {
			return '[Specification]';
		}
	}

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

	class OrSpecification extends Specification {
		constructor(specificationOne, specificationTwo) {
			super();

			assert.argumentIsRequired(specificationOne, 'specificationOne', Specification, 'Specification');
			assert.argumentIsRequired(specificationTwo, 'specificationTwo', Specification, 'Specification');

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

	Specification.AndSpecification = AndSpecification;
	Specification.OrSpecification = OrSpecification;

	return Specification;
})();
