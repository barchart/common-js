import * as is from './../lang/is.js';

import Specification from './Specification.js';

/**
 * A {@link Specification} that passes when a data item evaluates to NaN.
 *
 * @public
 * @extends {Specification}
 */
export default class Nan extends Specification {
	constructor() {
		super();
	}

	/**
	 * @protected
	 * @override
	 * @param {*} data
	 * @returns {boolean}
	 */
	_evaluate(data) {
		return is.nan(data);
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[Nan]';
	}
}
