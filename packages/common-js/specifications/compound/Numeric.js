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

	_evaluate(data) {
		return is.array(data) && data.every(item => is.number(item));
	}

	toString() {
		return '[Numeric]';
	}
}
