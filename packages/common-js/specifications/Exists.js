import Specification from './Specification.js';
import Null from './Null.js';
import Undefined from './Undefined.js';

/**
 * A {@link Specification} that passes when the value of the item passed to
 * the constructor is neither null or undefined.
 *
 * @public
 * @extends {Specification}
 */
export default class Exists extends Specification {
	constructor() {
		super();

		const n = new Null();
		const u = new Undefined();

		this._wrapped = n.or(u).not();
	}

	_evaluate(data) {
		return this._wrapped.evaluate(data);
	}

	toString() {
		return '[Exists]';
	}
}
