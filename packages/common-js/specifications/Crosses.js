import * as assert from './../lang/assert.js';
import * as is from './../lang/is.js';

import Specification from './Specification.js';

/**
 * A stateful {@link Specification} that passes when the value of the data item
 * crosses a value passed to the constructor. The specification will never pass
 * on the first evaluation. Instead, the first data item is used to determine
 * if the value is currently greater than (or less than) the threshold value
 * (passed to the constructor). This determines if the passing condition means
 * the value must be less than (or greater than) the threshold.
 *
 * @public
 * @extends {Specification}
 */
export default class CrossesSpecification extends Specification {
	#threshold;
	#previous;

	/**
	 * @param {number} threshold
	 */
	constructor(threshold) {
		super();

		assert.argumentIsRequired(threshold, 'threshold', Number);

		this.#threshold = threshold;

		this.#previous = null;
	}

	/**
	 * @protected
	 * @override
	 * @param {*} data
	 * @returns {boolean}
	 */
	_evaluate(data) {
		if (!is.number(data)) {
			return false;
		}

		const current = data;
		const previous = this.#previous;

		const crossed = previous !== null &&
			(
				(previous > this.#threshold && !(current > this.#threshold)) ||
				(previous < this.#threshold && !(current < this.#threshold))
			);

		this.#previous = current;

		return crossed;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[CrossesSpecification]';
	}
}
