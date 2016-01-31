var assert = require('./../lang/assert');

var Specification = require('./Specification');
var AndSpecification = require('./AndSpecification');
var OrSpecification = require('./OrSpecification');

module.exports = function() {
	var SpecificationBuilder = Class.extend({
		init: function(specification) {
			assert.argumentIsRequired(specification, 'specification', Specification, 'Specification');

			this._specification = specification;
		},

		and: function(other) {
			return new SpecificationBuilder(AndSpecificationBuilder(this._specification , other));
		},

		or: function(other) {
			return new SpecificationBuilder(OrSpecificationBuilder(this._specification , other));
		},

		build: function() {
			return this._specification;
		},

		toString: function() {
			return '[SpecificationBuilder]';
		}
	});

	SpecificationBuilder.startWith = function(specification) {
		return new SpecificationBuilder(specification);
	};

	return SpecificationBuilder;
}();