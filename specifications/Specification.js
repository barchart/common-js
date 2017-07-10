const assert = require('./../lang/assert');

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

		not() {
			return new NotSpecification(this);
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

	class NotSpecification extends Specification {
		constructor(otherSpecification) {
			super();

			assert.argumentIsRequired(otherSpecification, 'otherSpecification', Specification, 'Specification');

			this._otherSpecification = otherSpecification;
		}

		_evaluate(data) {
			return !this._otherSpecification.evaluate(data);
		}

		toString() {
			return '[NotSpecification]';
		}
	}

	Specification.AndSpecification = AndSpecification;
	Specification.OrSpecification = OrSpecification;
	Specification.NotSpecification = NotSpecification;

	return Specification;
})();
