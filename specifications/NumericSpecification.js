var assert = require('./../lang/assert');

var Specification = require('./Specification');

module.exports = function() {
	var NumericSpecification = Specification.extend({
		init: function() {
			this._super();
		},

		_evaluate: function(data) {
			return typeof data === 'number';
		},

		toString: function() {
			return '[NumericSpecification]';
		}
	});

	return NumericSpecification;
}();