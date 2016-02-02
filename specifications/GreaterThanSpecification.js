var assert = require('./../lang/assert');

var Specification = require('./Specification');

module.exports = function() {
	var GreaterThanSpecification = Specification.extend({
		init: function(value) {
			assert.argumentIsRequired(value, 'value', Number);

			this._value = value;
		},

		_evaluate: function(data) {
			assert.argumentIsRequired(data, 'data', Number);

			var returnVal = data > this._value;

			console.log(data + ' ' + (returnVal ? 'is' : 'is not') + ' greater than ' + this._value);

			return returnVal;
		},

		toString: function() {
			return '[GreaterThanSpecification]';
		}
	});

	return GreaterThanSpecification;
}();