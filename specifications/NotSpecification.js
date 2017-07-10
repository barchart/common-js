const assert = require('./../lang/assert');

const Specification = require('./Specification');

module.exports = (() => {
	'use strict';

	class NotSpecification extends Specification {
		constructor(otherSpecification) {
			super();

			assert.argumentIsRequired(otherSpecification, 'otherSpecification', Specification, 'Specification');

			this._otherSpecification = otherSpecification;
		}

		_evaluate(data) {
			return !this._otherSpecification.evaluate(data);
		}

		toString() {
			return '[OrSpecification]';
		}
	}

	return NotSpecification;
})();