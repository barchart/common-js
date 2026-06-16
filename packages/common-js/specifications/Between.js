import * as assert from './../lang/assert.js';

import Specification from './Specification.js';

/**
 * A {@link Specification} that passes when the value of the data item
 * is between the values passed to the constructor.
 *
 * @public
 * @extends {Specification}
 * @param {Number[]} values
 */
export default class Between extends Specification {
	constructor(values) {
		super();

		assert.argumentIsArray(values, 'values', Number);

		this._values = values;
	}

	_evaluate(data) {
		assert.argumentIsRequired(data, 'data', Number);

		return data > this._values[0] && data < this._values[1];
	}

	toString() {
		return '[Between]';
	}
}
