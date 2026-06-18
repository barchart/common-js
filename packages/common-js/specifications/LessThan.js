import * as assert from './../lang/assert.js';

import Specification from './Specification.js';

/**
 * A {@link Specification} that passes when the value of the item passed to
 * the constructor exceeds the value of the data item.
 *
 * @public
 * @extends {Specification}
 */
export default class LessThan extends Specification {
	#value;

	/**
	 * @param {number} value
	 */
	constructor(value) {
		super();

		assert.argumentIsRequired(value, 'value', Number);

		this.#value = value;
	}

	/**
	 * @protected
	 * @override
	 * @param {*} data
	 * @returns {boolean}
	 */
	_evaluate(data) {
		assert.argumentIsRequired(data, 'data', Number);

		return data < this.#value;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[LessThan]';
	}
}
