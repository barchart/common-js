const is = require('./../lang/is');

const Specification = require('./Specification');

module.exports = (() => {
	'use strict';

	/**
	 * A stateful {@link Specification} that passes when the value of the data item
	 * is a changes. This specification will never pass on the first data
	 * item tested. Instead, the first data item sets the "previous" value
	 * used to compare the next data item to.
	 *
	 * @public
	 * @extends {Specification}
	 * @param {*} value
	 */
	class ChangesSpecification extends Specification {
		constructor() {
			super();

			this._previous = null;
		}

		_evaluate(data) {
			if (is.null(data) || is.undefined(data)) {
				return false;
			}

			const current = data;
			const previous = this._previous;

			const changed = !is.null(previous) && previous !== current;

			this._previous = current;

			return changed;
		}

		toString() {
			return '[ChangesSpecification]';
		}
	}

	return ChangesSpecification;
})();