var assert = require('./../lang/assert');

var Specification = require('./Specification');

module.exports = function() {
	var PassSpecification = Specification.extend({
		init: function(value) {
			this._super();
		},

		_evaluate: function(data) {
			return true;
		},

		toString: function() {
			return '[PassSpecification]';
		}
	});

	return PassSpecification;
}();