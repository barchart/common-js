var Class = require('class.extend');

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

		toString: function() {
			return '[Specification]';
		}
	});

	return Specification;
}();