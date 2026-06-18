import * as is from './../../lang/is.js';

import Specification from './../Specification.js';

/**
 * A {@link Specification} that passes when the absolute difference between the
 * first item and second items in an array is less than or equal to a tolerance
 * value.
 *
 * @public
 * @extends {Specification}
 */
export default class Within extends Specification {
	#tolerance;

	/**
	 * @param {number} tolerance
	 */
	constructor(tolerance) {
		super();

		this.#tolerance = tolerance;
	}

	/**
	 * @protected
	 * @override
	 * @param {*} data
	 * @returns {boolean}
	 */
	_evaluate(data) {
		return is.array(data) && data.length === 2 && Math.abs(data[0] - data[1]) <= this.#tolerance;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[Within]';
	}
}
