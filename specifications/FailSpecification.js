var Specification = require('./Specification');

module.exports = function() {
	var FailSpecification = Specification.extend({
		init: function(value) {
			this._super();
		},

		_evaluate: function(data) {
			return false;
		},

		toString: function() {
			return '[FailSpecification]';
		}
	});

	return FailSpecification;
}();