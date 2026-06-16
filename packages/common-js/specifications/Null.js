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

	_evaluate(data) {
		return is.null(data);
	}

	toString() {
		return '[Null]';
	}
}
