import * as assert from './../../lang/assert.js';
import * as comparators from './comparators.js';

/**
 * A builder for compound comparator functions (e.g. sort by last name,
 * then by first name, then by social security number) that uses a fluent
 * interface.
 *
 * @public
 */
export default class ComparatorBuilder {
	#comparator;
	#invert;
	#previous;

	/**
	 * @param {Function} comparator - The initial comparator.
	 * @param {boolean=} invert - Indicates if the comparator should sort in descending order.
	 * @param {ComparatorBuilder=} previous - The previous comparator builder in the chain.
	 */
	constructor(comparator, invert, previous) {
		assert.argumentIsRequired(comparator, 'comparator', Function);
		assert.argumentIsOptional(invert, 'invert', Boolean);

		this.#comparator = comparator;
		this.#invert = invert || false;
		this.#previous = previous || null;
	}

	/**
	 * Adds a new comparator to the list of comparators to use.
	 *
	 * @public
	 * @param {Function} comparator - The next comparator function.
	 * @param {boolean=} invert - Indicates if the comparator should sort in descending order.
	 * @returns {ComparatorBuilder}
	 */
	thenBy(comparator, invert) {
		assert.argumentIsRequired(comparator, 'comparator', Function);
		assert.argumentIsOptional(invert, 'invert', Boolean);

		return new ComparatorBuilder(comparator, invert, this);
	}

	/**
	 * Flips the order of the comparator (e.g. ascending to descending).
	 *
	 * @public
	 * @returns {ComparatorBuilder}
	 */
	invert() {
		let previous;

		if (this.#previous) {
			previous = this.#previous.invert();
		} else {
			previous = null;
		}

		return new ComparatorBuilder(this.#comparator, !this.#invert, previous);
	}

	/**
	 * Returns the comparator function.
	 *
	 * @public
	 * @returns {Function}
	 */
	toComparator() {
		let previousComparator;

		if (this.#previous) {
			previousComparator = this.#previous.toComparator();
		} else {
			previousComparator = comparators.empty;
		}

		return (a, b) => {
			let result = previousComparator(a, b);

			if (result === 0) {
				let sortA;
				let sortB;

				if (this.#invert) {
					sortA = b;
					sortB = a;
				} else {
					sortA = a;
					sortB = b;
				}

				result = this.#comparator(sortA, sortB);
			}

			return result;
		};
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[ComparatorBuilder]';
	}

	/**
	 * Creates a {@link ComparatorBuilder}, given an initial comparator function.
	 *
	 * @public
	 * @static
	 * @param {Function} comparator - The initial comparator.
	 * @param {boolean=} invert - Indicates if the comparator should sort in descending order.
	 * @returns {ComparatorBuilder}
	 */
	static startWith(comparator, invert) {
		return new ComparatorBuilder(comparator, invert);
	}
}
