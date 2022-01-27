const is = require('./../lang/is');

const Specification = require('./Specification');

module.exports = (() => {
	'use strict';

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
	class Changes extends Specification {
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
			return '[Changes]';
		}
	}

	return Changes;
})();