import Specification from './Specification.js';
import Null from './Null.js';
import Undefined from './Undefined.js';

/**
 * A {@link Specification} that passes when the value of the item passed to
 * the constructor is neither null nor undefined.
 *
 * @public
 * @extends {Specification}
 */
export default class Exists extends Specification {
	#wrapped;

	constructor() {
		super();

		const n = new Null();
		const u = new Undefined();

		this.#wrapped = n.or(u).not();
	}

	/**
	 * @protected
	 * @override
	 * @param {*} data
	 * @returns {boolean}
	 */
	_evaluate(data) {
		return this.#wrapped.evaluate(data);
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[Exists]';
	}
}
