const assert = require('./../../lang/assert'),
	comparators = require('./comparators');

module.exports = (() => {
	'use strict';

	class ComparatorBuilder {
		constructor(comparator, invert, previous) {
			assert.argumentIsRequired(comparator, 'comparator', Function);
			assert.argumentIsOptional(invert, 'invert', Boolean);

			this._comparator = comparator;
			this._invert = invert || false;
			this._previous = previous || null;
		}

		thenBy(comparator, invert) {
			assert.argumentIsRequired(comparator, 'comparator', Function);
			assert.argumentIsOptional(invert, 'invert', Boolean);

			return new ComparatorBuilder(comparator, invert, this);
		}

		invert() {
			let previous;

			if (this._previous) {
				previous = this._previous.invert();
			} else {
				previous = null;
			}

			return new ComparatorBuilder(this._comparator, !this._invert, previous);
		}

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

		static startWith(comparator, invert) {
			return new ComparatorBuilder(comparator, invert);
		}
	}

	return ComparatorBuilder;
})();