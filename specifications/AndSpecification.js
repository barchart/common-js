var assert = require('./../lang/assert');

var Specification = require('./Specification');

module.exports = function() {
	var AndSpecification = Specification.extend({
		init: function(specificationOne, specificationTwo) {
			assert.argumentIsRequired(specificationOne, 'specificationOne', Specification, 'Specification');
			assert.argumentIsRequired(specificationTwo, 'specificationTwo', Specification, 'Specification');

			this._super();

			this._specificationOne = specificationOne;
			this._specificationTwo = specificationTwo;
		},

		_evaluate: function(data) {
			return this._specificationOne(data) && this._specificationTwo(data);
		},

		toString: function() {
			return '[AndSpecification]';
		}
	});

	return AndSpecification;
}();