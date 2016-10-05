var assert = require('./../lang/assert');

var Specification = require('./Specification');
var AndSpecification = require('./AndSpecification');
var OrSpecification = require('./OrSpecification');

module.exports = (() => {
	'use strict';

	class Specification {
		constructor() {

		}

		evaluate(data) {
			return this._evaluate(data);
		}

		_evaluate(data) {
			return false;
		}

		and(other) {
			assert.argumentIsRequired(other, 'other', Specification, 'Specification');

			return new AndSpecification(this, other);
		}

		or(other) {
			assert.argumentIsRequired(other, 'other', Specification, 'Specification');

			return new OrSpecification(this, other);
		}

		toString() {
			return '[Specification]';
		}
	}

	return Specification;
})();