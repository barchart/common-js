import Specification from './Specification.js';

/**
 * A {@link Specification} that passes when an item (passed to the
 * constructor) is contained within an array passed as the data item.
 *
 * @public
 * @extends {Specification}
 * @param {*} value
 */
export default class Contains extends Specification {
	constructor(value) {
		super();

		this._value = value;
	}

	_evaluate(data) {
		return Array.isArray(data) && data.some((candidate) => candidate === this._value);
	}

	toString() {
		return '[Contains]';
	}
}
