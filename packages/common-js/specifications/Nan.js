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

	_evaluate(data) {
		return is.nan(data);
	}

	toString() {
		return '[Nan]';
	}
}
