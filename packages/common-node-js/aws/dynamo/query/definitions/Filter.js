const assert = require('@barchart/common-js/lang/assert');

const Expression = require('./Expression');

module.exports = (() => {
	'use strict';

	/**
	 * The collection of {@link Expression} objects that compose a filter.
	 *
	 * @public
	 * @param {Expression[]} expressions
	 */
	class Filter {
		constructor(expressions) {
			this._expressions = expressions;
		}

		/**
		 * The collection of {@link Expression} objects that compose a filter.
		 *
		 * @public
		 * @returns {Expression[]}
		 */
		get expressions() {
			return [...this._expressions];
		}

		/**
		 * Throws an {@link Error} if the instance is invalid.
		 *
		 * @public
		 */
		validate() {
			if (this._expressions.length === 0) {
				throw new Error('Filter must contain at least one Expression.');
			}

			if (!this._expressions.every((e => e instanceof Expression))) {
				throw new Error('Filter expression array can only contain Expression instances.');
			}

			this._expressions.forEach(e => e.validate());
		}

		/**
		 * Combines two {@link Filter} instances into a single new instance by using all
		 * expressions from each original filter.
		 *
		 * @public
		 * @static
		 * @param {Filter} a
		 * @param {Filter} b
		 */
		static merge(a, b) {
			assert.argumentIsRequired(a, 'a', Filter, 'Filter');
			assert.argumentIsRequired(b, 'b', Filter, 'Filter');

			if (a === b) {
				return new Filter(a.expressions);
			} else {
				return new Filter(a.expressions.concat(b.expressions));
			}
		}

		toString() {
			return '[Filter]';
		}
	}

	return Filter;
})();
