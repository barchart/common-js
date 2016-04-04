var assert = require('./../lang/assert');

var Specification = require('./Specification');

module.exports = function() {
	var GreaterThanSpecification = Specification.extend({
		init: function(value) {
			assert.argumentIsRequired(value, 'value', Number);

			this._super();

			this._value = value;
		},

		_evaluate: function(data) {
			assert.argumentIsRequired(data, 'data', Number);

			return data > this._value;
		},

		toString: function() {
			return '[GreaterThanSpecification]';
		}
	});

	return GreaterThanSpecification;
}();