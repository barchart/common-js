import * as assert from './../lang/assert.js';

import Specification from './Specification.js';

/**
 * A {@link Specification} that passes when an array (passed to the
 * constructor) contains the data item.
 *
 * @public
 * @extends {Specification}
 */
export default class Contained extends Specification {
	#value;

	/**
	 * @param {Array} value
	 */
	constructor(value) {
		super();

		assert.argumentIsArray(value, 'value');

		this.#value = value;
	}

	/**
	 * @protected
	 * @override
	 * @param {*} data
	 * @returns {boolean}
	 */
	_evaluate(data) {
		return this.#value.some((candidate) => candidate === data);
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[Contained]';
	}
}
