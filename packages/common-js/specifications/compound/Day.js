import * as is from './../../lang/is.js';

import DayClazz from './../../lang/Day.js';
import Specification from './../Specification.js';

/**
 * @public
 * @extends {Specification}
 */
export default class Day extends Specification {
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
		return is.array(data) && data.every(item => item instanceof DayClazz);
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[Day]';
	}
}
