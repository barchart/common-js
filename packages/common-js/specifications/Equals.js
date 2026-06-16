import Specification from './Specification.js';

/**
 * A {@link Specification} that passes when an item (passed to the
 * constructor) is strictly equal to the data item.
 *
 * @public
 * @extends {Specification}
 * @param {*} value
 */
export default class Equals extends Specification {
	constructor(value) {
		super();

		this._value = value;
	}

	_evaluate(data) {
		return data === this._value;
	}

	toString() {
		return '[Equals]';
	}
}
