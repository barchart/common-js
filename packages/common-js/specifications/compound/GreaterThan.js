import * as is from './../../lang/is.js';

import Specification from './../Specification.js';

/**
 * A {@link Specification} that passes when the first item in an
 * array is greater than the second item in the array.
 *
 * @public
 * @extends {Specification}
 */
export default class GreaterThan extends Specification {
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
		return is.array(data) && data.length === 2 && data[0] > data[1];
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[GreaterThan]';
	}
}
