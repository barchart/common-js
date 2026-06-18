import * as is from './../lang/is.js';

import Specification from './Specification.js';

/**
 * A {@link Specification} that passes when a data item is an undefined value.
 *
 * @public
 * @extends {Specification}
 */
export default class Undefined extends Specification {
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
		return is.undef(data);
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[Undefined]';
	}
}
