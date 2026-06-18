import * as assert from './../lang/assert.js';

import Specification from './Specification.js';

/**
 * A {@link Specification} that passes when the value of the data item
 * is between the values passed to the constructor.
 *
 * @public
 * @extends {Specification}
 */
export default class Between extends Specification {
	#values;

	/**
	 * @param {number[]} values
	 */
	constructor(values) {
		super();

		assert.argumentIsArray(values, 'values', Number);

		this.#values = values;
	}

	/**
	 * @protected
	 * @override
	 * @param {*} data
	 * @returns {boolean}
	 */
	_evaluate(data) {
		assert.argumentIsRequired(data, 'data', Number);

		return data > this.#values[0] && data < this.#values[1];
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[Between]';
	}
}
