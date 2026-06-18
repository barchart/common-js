import * as is from './../../lang/is.js';

import Specification from './../Specification.js';

/**
 * A {@link Specification} that passes when the first item in an
 * array is Day instance that is after the second item in the array.
 *
 * @public
 * @extends {Specification}
 */
export default class After extends Specification {
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
		return is.array(data) && data.length === 2 && data[0].getIsAfter(data[1]);
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[After]';
	}
}
