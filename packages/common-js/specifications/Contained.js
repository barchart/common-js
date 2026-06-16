import * as assert from './../lang/assert.js';

import Specification from './Specification.js';

/**
 * A {@link Specification} that passes when an array (passed to the
 * constructor) contains the data item.
 *
 * @public
 * @extends {Specification}
 * @param {Array} value
 */
export default class Contained extends Specification {
	constructor(value) {
		super();

		assert.argumentIsArray(value, 'value');

		this._value = value;
	}

	_evaluate(data) {
		return this._value.some((candidate) => candidate === data);
	}

	toString() {
		return '[Contained]';
	}
}
