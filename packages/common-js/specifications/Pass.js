import Specification from './Specification.js';

/**
 * A {@link Specification} that always passes.
 *
 * @public
 * @extends {Specification}
 */
export default class Pass extends Specification {
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
		return true;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[Pass]';
	}
}
