const assert = require('./../../lang/assert'),
	comparators = require('./comparators');

module.exports = (() => {
	'use strict';

	/**
	 * A builder for compound comparator functions (e.g. sort by last name,
	 * then by first name, then by social security number) that uses a fluent
	 * interface.
	 *
	 * @public
	 * @param {Function} comparator - The initial comparator.
	 * @param {Boolean=} invert - Indicates if the comparator should sort in descending order.
	 */
	class ComparatorBuilder {
		constructor(comparator, invert, previous) {
			assert.argumentIsRequired(comparator, 'comparator', Function);
			assert.argumentIsOptional(invert, 'invert', Boolean);

			this._comparator = comparator;
			this._invert = invert || false;
			this._previous = previous || null;
		}

		/**
		 * Adds a new comparator to the list of comparators to use.
		 *
		 * @public
		 * @param {Function} comparator - The next comparator function.
		 * @param {Boolean=} invert - Indicates if the comparator should sort in descending order.
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

			if (this._previous) {
				previous = this._previous.invert();
			} else {
				previous = null;
			}

			return new ComparatorBuilder(this._comparator, !this._invert, previous);
		}

		/**
		 * Returns the comparator function.
		 *
		 * @public
		 * @returns {Function}
		 */
		toComparator() {
			let previousComparator;

			if (this._previous) {
				previousComparator = this._previous.toComparator();
			} else {
				previousComparator = comparators.empty;
			}

			return (a, b) => {
				let result = previousComparator(a, b);

				if (result === 0) {
					let sortA;
					let sortB;

					if (this._invert) {
						sortA = b;
						sortB = a;
					} else {
						sortA = a;
						sortB = b;
					}

					result = this._comparator(sortA, sortB);
				}

				return result;
			};
		}

		toString() {
			return '[ComparatorBuilder]';
		}

		/**
		 * Creates a {@link ComparatorBuilder}, given an initial comparator function.
		 *
		 * @public
		 * @param {Function} comparator - The initial comparator.
		 * @param {Boolean=} invert - Indicates if the comparator should sort in descending order.
		 * @returns {ComparatorBuilder}
		 */
		static startWith(comparator, invert) {
			return new ComparatorBuilder(comparator, invert);
		}
	}

	return ComparatorBuilder;
})();