import * as is from './../lang/is.js';

import Specification from './Specification.js';

/**
 * A {@link Specification} that passes when the type of the data item
 * is a number.
 *
 * @public
 * @extends {Specification}
 * @param {*} value
 */
export default class Numeric extends Specification {
	constructor() {
		super();
	}

	_evaluate(data) {
		return is.number(data);
	}

	toString() {
		return '[Numeric]';
	}
}
