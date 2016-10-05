var Class = require('class.extend');

var assert = require('./../lang/assert');

module.exports = function() {
	var Specification = Class.extend({
		init: function() {

		},

		evaluate: function(data) {
			return this._evaluate(data);
		},

		_evaluate: function(data) {
			return false;
		},

		and: function(other) {
			assert.argumentIsRequired(other, 'other', Specification, 'Specification');

			return new AndSpecification(this, other);
		},

		or: function(other) {
			assert.argumentIsRequired(other, 'other', Specification, 'Specification');

			return new OrSpecification(this, other);
		},

		toString: function() {
			return '[Specification]';
		}
	});

	var AndSpecification = Specification.extend({
		init: function(specificationOne, specificationTwo) {
			assert.argumentIsRequired(specificationOne, 'specificationOne', Specification, 'Specification');
			assert.argumentIsRequired(specificationTwo, 'specificationTwo', Specification, 'Specification');

			this._super();

			this._specificationOne = specificationOne;
			this._specificationTwo = specificationTwo;
		},

		_evaluate: function(data) {
			return this._specificationOne.evaluate(data) && this._specificationTwo.evaluate(data);
		},

		toString: function() {
			return '[AndSpecification]';
		}
	});

	var OrSpecification = Specification.extend({
		init: function(specificationOne, specificationTwo) {
			assert.argumentIsRequired(specificationOne, 'specificationOne', Specification, 'Specification');
			assert.argumentIsRequired(specificationTwo, 'specificationTwo', Specification, 'Specification');

			this._super();

			this._specificationOne = specificationOne;
			this._specificationTwo = specificationTwo;
		},

		_evaluate: function(data) {
			return this._specificationOne.evaluate(data) || this._specificationTwo.evaluate(data);
		},

		toString: function() {
			return '[OrSpecification]';
		}
	});

	Specification.AndSpecification = AndSpecification;
	Specification.OrSpecification = OrSpecification;

	return Specification;
}();