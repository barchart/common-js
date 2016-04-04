var Specification = require('./Specification');

module.exports = function() {
	var EqualsSpecification = Specification.extend({
		init: function(value) {
			this._super();

			this._value = value;
		},

		_evaluate: function(data) {
			return data === this._value;
		},

		toString: function() {
			return '[EqualsSpecification]';
		}
	});

	return EqualsSpecification;
}();