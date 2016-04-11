var _ = require('lodash');

var assert = require('./../lang/assert');

var Specification = require('./Specification');

module.exports = function() {
	var ContainedSpecification = Specification.extend({
		init: function(value) {
			assert.argumentIsArray(value, 'value');

			this._super();

			this._value = value;
		},

		_evaluate: function(data) {
			return _.contains(this._value, data);
		},

		toString: function() {
			return '[ContainedSpecification]';
		}
	});

	return ContainedSpecification;
}();