import * as assert from './../lang/assert.js';

import Specification from './Specification.js';

/**
 * A {@link Specification} that passes when the value of the data item
 * exceeds the value passed to the constructor.
 *
 * @public
 * @extends {Specification}
 * @param {Number} value
 */
export default class GreaterThan extends Specification {
	constructor(value) {
		super();

		assert.argumentIsRequired(value, 'value', Number);

		this._value = value;
	}

	_evaluate(data) {
		assert.argumentIsRequired(data, 'data', Number);

		return data > this._value;
	}

	toString() {
		return '[GreaterThan]';
	}
}
