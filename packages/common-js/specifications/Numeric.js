import * as is from './../lang/is.js';

import Specification from './Specification.js';

/**
 * A {@link Specification} that passes when the type of the data item
 * is a number.
 *
 * @public
 * @extends {Specification}
 */
export default class Numeric extends Specification {
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
		return is.number(data);
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[Numeric]';
	}
}
