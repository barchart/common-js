import Specification from './Specification.js';

/**
 * A {@link Specification} that always fails.
 *
 * @public
 * @extends {Specification}
 */
export default class Fail extends Specification {
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
		return false;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[Fail]';
	}
}
