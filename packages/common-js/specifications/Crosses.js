const assert = require('./../lang/assert');
	is = require('./../lang/is');

const Specification = require('./Specification');

module.exports = (() => {
	'use strict';

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
	 * @param {Number} threshold
	 */
	class CrossesSpecification extends Specification {
		constructor(threshold) {
			super();

			assert.argumentIsRequired(threshold, 'threshold', Number);

			this._threshold = threshold;

			this._previous = null;
		}

		_evaluate(data) {
			if (!is.number(data)) {
				return false;
			}

			const current = data;
			const previous = this._previous;

			const crossed = previous !== null &&
				(
					(previous > this._threshold && !(current > this._threshold)) ||
					(previous < this._threshold && !(current < this._threshold))
				);

			this._previous = current;

			return crossed;
		}

		toString() {
			return '[CrossesSpecification]';
		}
	}

	return CrossesSpecification;
})();