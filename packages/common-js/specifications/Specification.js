const assert = require('./../lang/assert');

module.exports = (() => {
	'use strict';

	/**
	 * Simple implementation of a specification pattern, where instances
	 * can be combined to form complex predicates.
	 *
	 * @public
	 */
	class Specification {
		constructor() {

		}

		/**
		 * Evaluates the specification, returning true or false.
		 *
		 * @public
		 * @param {*=} data
		 * @returns {Boolean}
		 */
		evaluate(data) {
			return this._evaluate(data);
		}

		/**
		 * @protected
		 */
		_evaluate(data) {
			return false;
		}

		/**
		 * Wraps the current instance and another {@link Specification} into a new
		 * specification which only evaluates to true when both wrapped specifications
		 * evaluate to true.
		 *
		 * @public
		 * @param {Specification} other
		 * @returns {And}
		 */
		and(other) {
			assert.argumentIsRequired(other, 'other', Specification, 'Specification');

			return new And(this, other);
		}

		/**
		 * Wraps the current instance and another {@link Specification} into a new
		 * specification which only evaluates to true when either of the wrapped
		 * specifications evaluate to true.
		 *
		 * @public
		 * @param {Specification} other
		 * @returns {Or}
		 */
		or(other) {
			assert.argumentIsRequired(other, 'other', Specification, 'Specification');

			return new Or(this, other);
		}

		/**
		 * Wraps the current instance in a new {@link Specification} which evaluates
		 * to the inverse result of the wrapped specification.
		 *
		 * @public
		 * @param {Specification} other
		 * @returns {Not}
		 */
		not() {
			return new Not(this);
		}

		toString() {
			return '[Specification]';
		}
	}

	class And extends Specification {
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
			return '[And]';
		}
	}

	class Or extends Specification {
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
			return '[Or]';
		}
	}

	class Not extends Specification {
		constructor(otherSpecification) {
			super();

			assert.argumentIsRequired(otherSpecification, 'otherSpecification', Specification, 'Specification');

			this._otherSpecification = otherSpecification;
		}

		_evaluate(data) {
			return !this._otherSpecification.evaluate(data);
		}

		toString() {
			return '[Not]';
		}
	}

	Specification.And = And;
	Specification.Or = Or;
	Specification.Not = Not;

	return Specification;
})();
