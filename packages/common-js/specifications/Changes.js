import * as is from './../lang/is.js';

import Specification from './Specification.js';

/**
 * A stateful {@link Specification} that passes when the value of the data item
 * a changes. This specification will never pass on the first data item tested.
 * Each invocation compares the previous data item to the current data item,
 * which means the specification can only pass on the second (or subsequent)
 * invocation.
 *
 * @public
 * @extends {Specification}
 */
export default class Changes extends Specification {
	#previous;

	constructor() {
		super();

		this.#previous = null;
	}

	/**
	 * @protected
	 * @override
	 * @param {*} data
	 * @returns {boolean}
	 */
	_evaluate(data) {
		if (is.nil(data) || is.undef(data)) {
			return false;
		}

		const current = data;
		const previous = this.#previous;

		const changed = !is.nil(previous) && previous !== current;

		this.#previous = current;

		return changed;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[Changes]';
	}
}
