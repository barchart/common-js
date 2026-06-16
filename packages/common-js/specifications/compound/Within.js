import * as is from './../../lang/is.js';

import Specification from './../Specification.js';

/**
 * A {@link Specification} that passes when the absolute difference between the
 * first item and second items in an array is less than or equal to a tolerance
 * value.
 *
 * @public
 * @extends {Specification}
 * @param {Number} tolerance
 */
export default class Within extends Specification {
	constructor(tolerance) {
		super();

		this._tolerance = tolerance;
	}

	_evaluate(data) {
		return is.array(data) && data.length === 2 && Math.abs(data[0] - data[1]) <= this._tolerance;
	}

	toString() {
		return '[Within]';
	}
}
