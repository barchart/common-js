import * as is from './../lang/is.js';

import Specification from './Specification.js';

/**
 * A {@link Specification} that passes when a data item is a null value.
 *
 * @public
 * @extends {Specification}
 */
export default class Null extends Specification {
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
		return is.nil(data);
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[Null]';
	}
}
