import * as assert from './../lang/assert.js';

/**
 * Simple implementation of a specification pattern, where instances
 * can be combined to form complex predicates.
 *
 * @public
 */
export default class Specification {
	constructor() {

	}

	/**
	 * Evaluates the specification, returning true or false.
	 *
	 * @public
	 * @param {*=} data
	 * @returns {boolean}
	 */
	evaluate(data) {
		return this._evaluate(data);
	}

	/**
	 * @protected
	 * @param {*=} data
	 * @returns {boolean}
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
	 * @returns {Not}
	 */
	not() {
		return new Not(this);
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[Specification]';
	}
}

/**
 * A {@link Specification} that combines two specifications with AND logic.
 *
 * @public
 * @extends {Specification}
 */
export class And extends Specification {
	#specificationOne;
	#specificationTwo;

	/**
	 * @param {Specification} specificationOne
	 * @param {Specification} specificationTwo
	 */
	constructor(specificationOne, specificationTwo) {
		super();

		assert.argumentIsRequired(specificationOne, 'specificationOne', Specification, 'Specification');
		assert.argumentIsRequired(specificationTwo, 'specificationTwo', Specification, 'Specification');

		this.#specificationOne = specificationOne;
		this.#specificationTwo = specificationTwo;
	}

	/**
	 * @protected
	 * @override
	 * @param {*=} data
	 * @returns {boolean}
	 */
	_evaluate(data) {
		return this.#specificationOne.evaluate(data) && this.#specificationTwo.evaluate(data);
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[And]';
	}
}

/**
 * A {@link Specification} that combines two specifications with OR logic.
 *
 * @public
 * @extends {Specification}
 */
export class Or extends Specification {
	#specificationOne;
	#specificationTwo;

	/**
	 * @param {Specification} specificationOne
	 * @param {Specification} specificationTwo
	 */
	constructor(specificationOne, specificationTwo) {
		super();

		assert.argumentIsRequired(specificationOne, 'specificationOne', Specification, 'Specification');
		assert.argumentIsRequired(specificationTwo, 'specificationTwo', Specification, 'Specification');

		this.#specificationOne = specificationOne;
		this.#specificationTwo = specificationTwo;
	}

	/**
	 * @protected
	 * @override
	 * @param {*=} data
	 * @returns {boolean}
	 */
	_evaluate(data) {
		return this.#specificationOne.evaluate(data) || this.#specificationTwo.evaluate(data);
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[Or]';
	}
}

/**
 * A {@link Specification} that negates another specification.
 *
 * @public
 * @extends {Specification}
 */
export class Not extends Specification {
	#otherSpecification;

	/**
	 * @param {Specification} otherSpecification
	 */
	constructor(otherSpecification) {
		super();

		assert.argumentIsRequired(otherSpecification, 'otherSpecification', Specification, 'Specification');

		this.#otherSpecification = otherSpecification;
	}

	/**
	 * @protected
	 * @override
	 * @param {*=} data
	 * @returns {boolean}
	 */
	_evaluate(data) {
		return !this.#otherSpecification.evaluate(data);
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[Not]';
	}
}

Specification.And = And;
Specification.Or = Or;
Specification.Not = Not;
