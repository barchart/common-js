var _ = require('lodash');

var Specification = require('./Specification');

module.exports = function() {
	var ContainsSpecification = Specification.extend({
		init: function(value) {
			this._value = value;
		},

		_evaluate: function(data) {
			return _.isArray(data) && _.contains(data, this._value);
		},

		toString: function() {
			return '[ContainsSpecification]';
		}
	});

	return ContainsSpecification;
}();