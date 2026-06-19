import * as assert from '@barchart/common-js/lang/assert.js';

import Expression from './Expression.js';

/**
 * The collection of {@link Expression} objects that compose a filter.
 *
 * @public
 */
export default class Filter {
	#expressions;

	/**
	 * @param {Expression[]} expressions
	 */
	constructor(expressions) {
		this.#expressions = expressions;
	}

	/**
	 * The collection of {@link Expression} objects that compose a filter.
	 *
	 * @public
	 * @returns {Expression[]}
	 */
	get expressions() {
		return [...this.#expressions];
	}

	/**
	 * Throws an {@link Error} if the instance is invalid.
	 *
	 * @public
	 */
	validate() {
		if (this.#expressions.length === 0) {
			throw new Error('Filter must contain at least one Expression.');
		}

		if (!this.#expressions.every((e => e instanceof Expression))) {
			throw new Error('Filter expression array can only contain Expression instances.');
		}

		this.#expressions.forEach(e => e.validate());
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

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[Filter]';
	}
}
