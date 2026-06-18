import * as is from './../../lang/is.js';

import Specification from './../Specification.js';

/**
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
		return is.array(data) && data.every(item => is.number(item));
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
