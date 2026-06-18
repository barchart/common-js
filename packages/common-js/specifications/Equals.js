import Specification from './Specification.js';

/**
 * A {@link Specification} that passes when an item (passed to the
 * constructor) is strictly equal to the data item.
 *
 * @public
 * @extends {Specification}
 */
export default class Equals extends Specification {
	#value;

	/**
	 * @param {*} value
	 */
	constructor(value) {
		super();

		this.#value = value;
	}

	/**
	 * @protected
	 * @override
	 * @param {*} data
	 * @returns {boolean}
	 */
	_evaluate(data) {
		return data === this.#value;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[Equals]';
	}
}
