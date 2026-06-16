import Specification from './Specification.js';

/**
 * A {@link Specification} that always passes.
 *
 * @public
 * @extends {Specification}
 */
export default class Pass extends Specification {
	constructor() {
		super();
	}

	_evaluate(data) {
		return true;
	}

	toString() {
		return '[Pass]';
	}
}
