import Specification from './Specification.js';

/**
 * A {@link Specification} that always fails.
 *
 * @public
 * @extends {Specification}
 */
export default class Fail extends Specification {
	constructor() {
		super();
	}

	_evaluate(data) {
		return false;
	}

	toString() {
		return '[Fail]';
	}
}
