import Specification from './Specification.js';

/**
 * A {@link Specification} that passes when an item (passed to the
 * constructor) is contained within an array passed as the data item.
 *
 * @public
 * @extends {Specification}
 */
export default class Contains extends Specification {
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
		return Array.isArray(data) && data.some((candidate) => candidate === this.#value);
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[Contains]';
	}
}
